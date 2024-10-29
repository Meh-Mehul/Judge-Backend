This is my try of a simple online code execution engine made using Judge0 system as the container orchestrator.
TODO:
  1. I might improve the frontend someday
  2. add support for cpp, java, and maybe not rust
  3. add feature for multi-testcase eval (as judge0 provides checker in-house)
  4. further lower latency as current implementation taken about 2 seconds on a big code (about 300 lines).
The following is the diagram of current Implementation of architecture of this judge:
![alt text](https://github.com/Meh-Mehul/Judge-Backend/blob/main/arch.png)
