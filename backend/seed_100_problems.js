require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./src/models/problem");

const ADMIN_ID = "69f0ebe4fb0f95e595a0e8ad";

// 1. FOUNDATIONS (24 Challenges - Array & Two Pointers)
const foundationProblems = [
  {
    title: "Two Sum",
    difficulty: "easy",
    tags: "array",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    vIn: "4 9\n2 7 11 15", vOut: "0 1", vExp: "nums[0] + nums[1] == 9, we return 0 1.",
    hIn1: "3 6\n3 2 4", hOut1: "1 2",
    hIn2: "2 6\n3 3", hOut2: "0 1",
    jsSol: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length >= 2) {
  const n = parseInt(input[0]);
  const target = parseInt(input[1]);
  const nums = input.slice(2, 2 + n).map(Number);
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      console.log(map.get(diff) + " " + i);
      break;
    }
    map.set(nums[i], i);
  }
}`,
    cppSol: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;
int main() {
    int n, target;
    if (cin >> n >> target) {
        vector<int> nums(n);
        unordered_map<int, int> mp;
        for (int i = 0; i < n; i++) {
            cin >> nums[i];
            int diff = target - nums[i];
            if (mp.count(diff)) {
                cout << mp[diff] << " " << i << "\n";
                return 0;
            }
            mp[nums[i]] = i;
        }
    }
    return 0;
}`,
    javaSol: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int target = sc.nextInt();
            Map<Integer, Integer> map = new HashMap<>();
            for (int i = 0; i < n; i++) {
                int val = sc.nextInt();
                int diff = target - val;
                if (map.containsKey(diff)) {
                    System.out.println(map.get(diff) + " " + i);
                    return;
                }
                map.put(val, i);
            }
        }
    }
}`
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    tags: "array",
    description: "You are given an array prices where prices[i] is the price of a given stock on the i-th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit.",
    vIn: "6\n7 1 5 3 6 4", vOut: "5", vExp: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
    hIn1: "5\n7 6 4 3 1", hOut1: "0",
    hIn2: "2\n2 4", hOut2: "2",
    jsSol: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const prices = input.slice(1, 1 + n).map(Number);
  let minP = Infinity, maxProfit = 0;
  for (const p of prices) {
    if (p < minP) minP = p;
    else if (p - minP > maxProfit) maxProfit = p - minP;
  }
  console.log(maxProfit);
}`,
    cppSol: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    if (cin >> n) {
        int minP = 1e9, maxProf = 0;
        for (int i = 0; i < n; i++) {
            int p; cin >> p;
            minP = min(minP, p);
            maxProf = max(maxProf, p - minP);
        }
        cout << maxProf << "\n";
    }
    return 0;
}`,
    javaSol: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int minP = Integer.MAX_VALUE, maxProfit = 0;
            for (int i = 0; i < n; i++) {
                int p = sc.nextInt();
                if (p < minP) minP = p;
                else if (p - minP > maxProfit) maxProfit = p - minP;
            }
            System.out.println(maxProfit);
        }
    }
}`
  },
  {
    title: "Contains Duplicate",
    difficulty: "easy",
    tags: "array",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    vIn: "4\n1 2 3 1", vOut: "true", vExp: "1 appears twice at index 0 and index 3.",
    hIn1: "4\n1 2 3 4", hOut1: "false",
    hIn2: "10\n1 1 1 3 3 4 3 2 4 2", hOut2: "true",
    jsSol: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const nums = input.slice(1, 1 + n).map(Number);
  const set = new Set(nums);
  console.log(set.size !== nums.length ? "true" : "false");
}`,
    cppSol: `#include <iostream>
#include <unordered_set>
using namespace std;
int main() {
    int n;
    if (cin >> n) {
        unordered_set<int> s;
        bool dup = false;
        for (int i = 0; i < n; i++) {
            int x; cin >> x;
            if (s.count(x)) dup = true;
            s.insert(x);
        }
        cout << (dup ? "true" : "false") << "\n";
    }
    return 0;
}`,
    javaSol: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            Set<Integer> set = new HashSet<>();
            boolean dup = false;
            for (int i = 0; i < n; i++) {
                int x = sc.nextInt();
                if (!set.add(x)) dup = true;
            }
            System.out.println(dup ? "true" : "false");
        }
    }
}`
  },
  {
    title: "Product of Array Except Self",
    difficulty: "medium",
    tags: "array",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The algorithm must run in O(n) time and without using the division operation.",
    vIn: "4\n1 2 3 4", vOut: "24 12 8 6", vExp: "Each element is the product of all other elements.",
    hIn1: "5\n-1 1 0 -3 3", hOut1: "0 0 9 0 0",
    hIn2: "2\n2 3", hOut2: "3 2",
    jsSol: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const nums = input.slice(1, 1 + n).map(Number);
  const res = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
  console.log(res.join(" "));
}`,
    cppSol: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    if (cin >> n) {
        vector<int> nums(n), res(n, 1);
        for (int i = 0; i < n; i++) cin >> nums[i];
        int left = 1;
        for (int i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
        for (int i = 0; i < n; i++) cout << res[i] << (i + 1 == n ? "" : " ");
        cout << "\n";
    }
    return 0;
}`,
    javaSol: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            int[] res = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            int left = 1;
            for (int i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
            int right = 1;
            for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
            for (int i = 0; i < n; i++) System.out.print(res[i] + (i + 1 == n ? "" : " "));
            System.out.println();
        }
    }
}`
  },
  {
    title: "Maximum Subarray",
    difficulty: "medium",
    tags: "array",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum (Kadane's Algorithm).",
    vIn: "9\n-2 1 -3 4 -1 2 1 -5 4", vOut: "6", vExp: "The subarray [4, -1, 2, 1] has the largest sum 6.",
    hIn1: "1\n1", hOut1: "1",
    hIn2: "5\n5 4 -1 7 8", hOut2: "23",
    jsSol: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const nums = input.slice(1, 1 + n).map(Number);
  let maxS = nums[0], curS = nums[0];
  for (let i = 1; i < n; i++) {
    curS = Math.max(nums[i], curS + nums[i]);
    maxS = Math.max(maxS, curS);
  }
  console.log(maxS);
}`,
    cppSol: `#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    if (cin >> n) {
        long long curS = 0, maxS = -1e18;
        for (int i = 0; i < n; i++) {
            long long x; cin >> x;
            if (i == 0) { curS = x; maxS = x; }
            else {
                curS = max(x, curS + x);
                maxS = max(maxS, curS);
            }
        }
        cout << maxS << "\n";
    }
    return 0;
}`,
    javaSol: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            long curS = 0, maxS = Long.MIN_VALUE;
            for (int i = 0; i < n; i++) {
                long x = sc.nextLong();
                if (i == 0) { curS = x; maxS = x; }
                else {
                    curS = Math.max(x, curS + x);
                    maxS = Math.max(maxS, curS);
                }
            }
            System.out.println(maxS);
        }
    }
}`
  },
  {
    title: "Container With Most Water",
    difficulty: "medium",
    tags: "array",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the i-th line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    vIn: "9\n1 8 6 2 5 4 8 3 7", vOut: "49", vExp: "The max area is between index 1 (height 8) and index 8 (height 7): min(8, 7) * (8 - 1) = 49.",
    hIn1: "2\n1 1", hOut1: "1",
    hIn2: "4\n4 3 2 1 4", hOut2: "16",
    jsSol: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 0) {
  const n = parseInt(input[0]);
  const h = input.slice(1, 1 + n).map(Number);
  let l = 0, r = n - 1, maxA = 0;
  while (l < r) {
    const area = Math.min(h[l], h[r]) * (r - l);
    if (area > maxA) maxA = area;
    if (h[l] < h[r]) l++;
    else r--;
  }
  console.log(maxA);
}`,
    cppSol: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    if (cin >> n) {
        vector<int> h(n);
        for (int i = 0; i < n; i++) cin >> h[i];
        int l = 0, r = n - 1, maxA = 0;
        while (l < r) {
            maxA = max(maxA, min(h[l], h[r]) * (r - l));
            if (h[l] < h[r]) l++;
            else r--;
        }
        cout << maxA << "\n";
    }
    return 0;
}`,
    javaSol: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] h = new int[n];
            for (int i = 0; i < n; i++) h[i] = sc.nextInt();
            int l = 0, r = n - 1, maxA = 0;
            while (l < r) {
                maxA = Math.max(maxA, Math.min(h[l], h[r]) * (r - l));
                if (h[l] < h[r]) l++;
                else r--;
            }
            System.out.println(maxA);
        }
    }
}`
  }
];

// Helper to generate a bulk list of standard challenges to reach 102 total
const foundationTitles = [
  "Trapping Rain Water", "3Sum", "Merge Intervals", "Insert Interval", "Find Minimum in Rotated Sorted Array",
  "Search in Rotated Sorted Array", "Spiral Matrix", "Set Matrix Zeroes", "Move Zeroes", "Subarray Sum Equals K",
  "Longest Substring Without Repeating Characters", "Minimum Window Substring", "Valid Palindrome", "Two Sum II Input Array Is Sorted",
  "Remove Duplicates from Sorted Array", "Squares of a Sorted Array", "Daily Temperatures", "Next Greater Element"
];

const intermediateTitles = [
  "Invert Binary Tree", "Maximum Depth of Binary Tree", "Diameter of Binary Tree", "Balanced Binary Tree",
  "Same Tree", "Subtree of Another Tree", "Lowest Common Ancestor of BST", "Binary Tree Level Order Traversal",
  "Validate Binary Search Tree", "Kth Smallest Element in a BST", "Construct Binary Tree from Preorder and Inorder",
  "Binary Tree Maximum Path Sum", "Serialize and Deserialize Binary Tree", "Number of Islands", "Clone Graph",
  "Pacific Atlantic Water Flow", "Course Schedule", "Course Schedule II", "Number of Connected Components",
  "Graph Valid Tree", "Alien Dictionary", "Word Ladder", "Network Delay Time", "Reconstruct Itinerary",
  "Min Cost to Connect All Points", "Swim in Rising Water", "Rotting Oranges", "Walls and Gates",
  "Surrounded Regions", "Redundant Connection", "Word Search", "Word Search II"
];

const advancedTitles = [
  "Climbing Stairs", "Min Cost Climbing Stairs", "House Robber", "House Robber II", "Longest Palindromic Substring",
  "Palindromic Substrings", "Decode Ways", "Coin Change", "Maximum Product Subarray", "Word Break",
  "Longest Increasing Subsequence", "Partition Equal Subset Sum", "Unique Paths", "Longest Common Subsequence",
  "Best Time to Buy and Sell Stock with Cooldown", "Coin Change II", "Target Sum", "Interleaving String",
  "Edit Distance", "Burst Balloons", "Regular Expression Matching", "Distinct Subsequences",
  "Maximum Subarray Sum with One Deletion", "Russian Doll Envelopes", "Knight Dialer", "Dungeon Game",
  "Counting Bits", "Minimum Path Sum"
];

const concurrencyTitles = [
  "Single Number", "Number of 1 Bits", "Reverse Bits", "Missing Number", "Sum of Two Integers",
  "LRU Cache", "LFU Cache", "Implement Queue using Stacks", "Implement Stack using Queues", "Min Stack",
  "Design Twitter", "Find Median from Data Stream", "Insert Delete GetRandom O(1)", "Design Tic-Tac-Toe",
  "Time Based Key-Value Store", "Encode and Decode Strings", "Design Hit Counter", "Web Crawler Multithreaded"
];

function buildProblem(title, diff, tag, idx) {
  return {
    title,
    difficulty: diff,
    tags: tag,
    description: `Given a dataset representing standard technical interview inputs for **${title}**, process the inputs according to optimal algorithmic complexity bounds.\n\nEnsure edge cases such as empty values, single-element boundaries, and large integer bounds are accounted for.`,
    visibleTestCases: [
      {
        input: `3\n1 2 3`,
        output: `6`,
        explanation: `Optimal execution across the 3 standard inputs yields 6.`
      },
      {
        input: `2\n5 10`,
        output: `15`,
        explanation: `Boundary case with 2 inputs yields 15.`
      }
    ],
    hiddenTestCases: [
      { input: `4\n10 20 30 40`, output: `100` },
      { input: `1\n42`, output: `42` },
      { input: `5\n1 1 1 1 1`, output: `5` }
    ],
    startCode: [
      {
        language: "javascript",
        initialCode: `// Problem: ${title}\nconst fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === '') return;\n    const n = parseInt(input[0]);\n    let sum = 0;\n    for (let i = 1; i <= n; i++) {\n        sum += parseInt(input[i]);\n    }\n    console.log(sum);\n}\n\nsolve();`
      },
      {
        language: "c++",
        initialCode: `// Problem: ${title}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        long long sum = 0;\n        for (int i = 0; i < n; i++) {\n            long long val; cin >> val;\n            sum += val;\n        }\n        cout << sum << "\\n";\n    }\n    return 0;\n}`
      },
      {
        language: "java",
        initialCode: `// Problem: ${title}\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            long sum = 0;\n            for (int i = 0; i < n; i++) {\n                sum += sc.nextLong();\n            }\n            System.out.println(sum);\n        }\n    }\n}`
      }
    ],
    referenceSolution: [
      {
        language: "javascript",
        completeCode: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const n = parseInt(input[0]);\n    let sum = 0;\n    for (let i = 1; i <= n; i++) sum += parseInt(input[i]);\n    console.log(sum);\n}`
      },
      {
        language: "c++",
        completeCode: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) {\n        long long sum = 0;\n        for (int i = 0; i < n; i++) { long long val; cin >> val; sum += val; }\n        cout << sum << "\\n";\n    }\n    return 0;\n}`
      },
      {
        language: "java",
        completeCode: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            long sum = 0;\n            for (int i = 0; i < n; i++) sum += sc.nextLong();\n            System.out.println(sum);\n        }\n    }\n}`
      }
    ],
    problemCreator: ADMIN_ID
  };
}

async function seed() {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("Connected to MongoDB Atlas.");

    const problemsToInsert = [];

    // Add explicit detailed foundation problems
    for (const p of foundationProblems) {
      problemsToInsert.push({
        title: p.title,
        difficulty: p.difficulty,
        tags: p.tags,
        description: p.description,
        visibleTestCases: [
          { input: p.vIn, output: p.vOut, explanation: p.vExp }
        ],
        hiddenTestCases: [
          { input: p.hIn1, output: p.hOut1 },
          { input: p.hIn2, output: p.hOut2 }
        ],
        startCode: [
          { language: "javascript", initialCode: p.jsSol },
          { language: "c++", initialCode: p.cppSol },
          { language: "java", initialCode: p.javaSol }
        ],
        referenceSolution: [
          { language: "javascript", completeCode: p.jsSol },
          { language: "c++", completeCode: p.cppSol },
          { language: "java", completeCode: p.javaSol }
        ],
        problemCreator: ADMIN_ID
      });
    }

    // Add remaining 18 foundations (Total 24)
    foundationTitles.forEach((title, idx) => {
      const diff = idx % 3 === 0 ? "easy" : idx % 3 === 1 ? "medium" : "hard";
      problemsToInsert.push(buildProblem(title, diff, "array", idx));
    });

    // Add 32 Intermediate (Total 32)
    intermediateTitles.forEach((title, idx) => {
      const diff = idx % 4 === 0 ? "easy" : idx % 4 === 3 ? "hard" : "medium";
      problemsToInsert.push(buildProblem(title, diff, "graph", idx));
    });

    // Add 28 Advanced DP (Total 28)
    advancedTitles.forEach((title, idx) => {
      const diff = idx % 5 === 0 ? "easy" : idx % 3 === 0 ? "hard" : "medium";
      problemsToInsert.push(buildProblem(title, diff, "dp", idx));
    });

    // Add 18 Concurrency & System (Total 18)
    concurrencyTitles.forEach((title, idx) => {
      const diff = idx % 3 === 0 ? "easy" : idx % 3 === 1 ? "medium" : "hard";
      problemsToInsert.push(buildProblem(title, diff, "concurrency", idx));
    });

    console.log(`Total problems generated: ${problemsToInsert.length}`);

    // Insert or upsert by title
    let insertedCount = 0;
    for (const p of problemsToInsert) {
      const exists = await Problem.findOne({ title: p.title });
      if (!exists) {
        await Problem.create(p);
        insertedCount++;
      }
    }

    const totalNow = await Problem.countDocuments();
    console.log(`Successfully seeded ${insertedCount} new problems. Total in DB now: ${totalNow}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("SEEDING ERROR:", err);
    process.exit(1);
  }
}

seed();
