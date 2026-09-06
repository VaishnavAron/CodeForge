require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('./models/problem');
const User = require('./models/user');

async function seed() {
  await mongoose.connect(process.env.DB_CONNECT_STRING);
  console.log('Connected to DB');

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log('No admin found!');
    process.exit(1);
  }

  const existing = await Problem.findOne({ title: 'Sum of Two Numbers' });
  if (existing) {
    console.log('Problem already exists!');
    process.exit(0);
  }

  const problem = await Problem.create({
    title: 'Sum of Two Numbers',
    description: 'Given two integers a and b from standard input, print their sum to standard output.\n\n### Input Format\nA single line containing two space-separated integers `a` and `b`.\n\n### Output Format\nPrint the sum of `a` and `b`.\n\n### Example 1\n**Input:** `3 5`\n**Output:** `8`',
    difficulty: 'easy',
    tags: 'array',
    visibleTestCases: [
      {
        input: '3 5',
        output: '8',
        explanation: '3 + 5 = 8'
      },
      {
        input: '10 20',
        output: '30',
        explanation: '10 + 20 = 30'
      }
    ],
    hiddenTestCases: [
      {
        input: '-5 15',
        output: '10'
      },
      {
        input: '100 250',
        output: '350'
      }
    ],
    startCode: [
      {
        language: 'javascript',
        initialCode: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length >= 2) {
        const a = parseInt(input[0], 10);
        const b = parseInt(input[1], 10);
        console.log(a + b);
    }
}

solve();`
      },
      {
        language: 'c++',
        initialCode: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    if (cin >> a >> b) {
        cout << (a + b) << endl;
    }
    return 0;
}`
      },
      {
        language: 'java',
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            System.out.println(a + b);
        }
    }
}`
      }
    ],
    referenceSolution: [
      {
        language: 'javascript',
        completeCode: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length >= 2) {
        const a = parseInt(input[0], 10);
        const b = parseInt(input[1], 10);
        console.log(a + b);
    }
}

solve();`
      },
      {
        language: 'c++',
        completeCode: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    if (cin >> a >> b) {
        cout << (a + b) << endl;
    }
    return 0;
}`
      },
      {
        language: 'java',
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            System.out.println(a + b);
        }
    }
}`
      }
    ],
    problemCreator: admin._id
  });

  console.log('Created problem successfully with ID:', problem._id);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
