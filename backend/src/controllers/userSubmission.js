const Problem=require('../models/problem');
const submission=require('../models/submission');
const {getLanguageById,submitBatch,submitToken}=require('../utils/problemUtility');


const submitCode=async(req,res)=>{
try{
     const userId=req.result._id;
     const problemId=req.params._id;

     const{code,language}=req.body;

  


     if(!userId||!code||!problemId||!language)
        return res.status(400).send("some field is missing ");

     // fetch the problem from database
     const problem=await Problem.findById(problemId);

     // storing the submission first on the database then giving to judge0 and then after getting the output from the judge 0 updating the database agin 
    const submittedResult=await submission.create({
       userId,
       problemId,
       code,
       language,
       status:'pending',
       testCasesTotal:problem.hiddenTestCases.length
    })

    //judge0 code ko submit karna hai 
  const languageId=getLanguageById(language);
  const submissions=problem.hiddenTestCases.map((testCase)=>({
        source_code:code,
        language_id:languageId,
       stdin: testCase.input,
      expected_output: testCase.output

      }));

      const submitResult=await submitBatch(submissions);
      
  const resultToken=submitResult.map((value)=>value.token);

 
   let finalResult;
   let attempts = 0;
   while (attempts < 25) {
      const result = await submitToken(resultToken);
      const isResultObtained = result.submissions.every(
          (r) => r.status && r.status.id > 2
      );
      if (isResultObtained) {
          finalResult = result.submissions;
          break;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
   }

   if (!finalResult) {
      throw new Error("Judge0 execution timed out after 25 seconds");
   }

  //submittedResult ko update kara
  let testcasesPassed=0;
  let runtime=0;
  let memory=0;
  let status='accepted';
  let errorMessage=null;
  let diffDetails=null;
  for(const test of finalResult){
    if(test.status && test.status.id == 3){
      testcasesPassed++;
      runtime = runtime + (parseFloat(test.time) || 0);
      memory = Math.max(memory, test.memory || 0);
    } else {
      const isError = test.status && (test.status.id === 4 || test.status.id === 6);
      status = isError ? 'error' : 'wrong';
      errorMessage = test.stderr || test.compile_output || test.message || 'Execution failed';
      if (!diffDetails) {
        diffDetails = {
          input: test.stdin,
          expected: test.expected_output,
          actual: test.stdout || test.stderr || test.compile_output || ""
        };
      }
    }
  }

  // store the result in the database in Submission

  submittedResult.status=status;
  submittedResult.testCasesPassed=testcasesPassed;
  submittedResult.errorMessage=errorMessage;
  submittedResult.runtime=runtime;
  submittedResult.memory=memory;

  await submittedResult.save();
  // Problem is only added to problemSolved if the submission was accepted
  if(status === 'accepted' && !req.result.problemSolved.includes(problemId)){
    req.result.problemSolved.push(problemId);
    await req.result.save();
  }
  const accepted=(status=='accepted')
  res.status(201).json({
    accepted,
    testCasesTotal:submittedResult.testCasesTotal,
    passedTestcases:testcasesPassed,
    runtime: Number(runtime.toFixed(3)),
    memory,
    errorMessage,
    diffDetails
  });
}
catch(err){
    console.error("SUBMIT ERROR:", err);
    res.status(200).json({
      accepted: false,
      passedTestcases: 0,
      testCasesTotal: 0,
      errorMessage: `Sandbox Runner Alert: ${err.message || "Public Judge0 CE execution timed out or queue is busy. Please retry in a few seconds."}`
    });
}


}

const runCode=async(req,res)=>{
  try{
     const userId=req.result._id;
     const problemId=req.params._id;

     const{code,language,customInput}=req.body;




     if(!userId||!code||!problemId||!language)
        return res.status(400).send("some field is missing ");

     // fetch the problem from database
     const problem=await Problem.findById(problemId);

     

    //judge0 code ko submit karna hai 
  const languageId=getLanguageById(language);
  let submissions;
  if (customInput !== undefined && customInput.trim() !== "") {
    submissions = [{
      source_code: code,
      language_id: languageId,
      stdin: customInput,
      expected_output: null
    }];
  } else {
    submissions = problem.visibleTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output
    }));
  }

      const submitResult=await submitBatch(submissions);
      
  const resultToken=submitResult.map((value)=>value.token);

 
   let finalResult;
   let attempts = 0;
   while (attempts < 25) {
      const result = await submitToken(resultToken);
      const isResultObtained = result.submissions.every(
          (r) => r.status && r.status.id > 2
      );
      if (isResultObtained) {
          finalResult = result.submissions;
          break;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
   }

   if (!finalResult) {
      throw new Error("Judge0 execution timed out after 25 seconds");
   }

  
  

  res.status(200).send(finalResult);
}
catch(err){
    console.error("RUN CODE ERROR:", err);
    res.status(200).json({
      success: false,
      error: `Sandbox Runner Alert: ${err.message || "Public Judge0 CE execution timed out or queue is busy. Please retry in a few seconds."}`
    });
}
}


module.exports={submitCode,runCode};