export const exampleContent = `/*
* JS is just an example. Apiarist can work with any programming languages supported by VSCode.
*/
class Example {
  example1() {
    const x = "";
    console.log(x);
    this.example2();
  }

  example2() {
    const x = "";
    console.log(x);
    new Example2().example1();
  }

  example3() {
    const x = "";
    console.log(x);
  }

  example4() {
    const x = "";
    console.log(x);
  }
}

class Example2 {
  example1() {
    const x = "";
    console.log(x);
    this.example2();
  }

  legacy() {
    if (true) {
      const x = "xxx";
      console.log(x);
    } else if (10 == 10) {
      const x = "xxx";
      console.log(x);
    }
  }

  example2() {
    const x = "123456";
    const x1 = "123456";
    const x2 = "123456";
    const x3 = "123456";
  }

  example3() {
    const x = "";
    console.log(x);
  }

  example4() {
    const x = "";
    console.log(x);
  }
}

class Seller {
  example1() {
    const x = "";
    console.log(x);
    this.example2();
  }
  example2() {
    const x = "";
    console.log(x);
    this.example2();
  }
  tests() {
    const x = "tests";
    console.log(x);
  }
  tests2() {
    const x = "tests2";
    console.log(x);
  }
}

class Buyer {
  example1() {
    const x = "";
    console.log(x);
    this.example2();
  }
  example2() {
    const x = "";
    console.log(x);
    this.example2();
  }
}`;