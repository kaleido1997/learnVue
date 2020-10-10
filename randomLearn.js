// let & var:
//      let定义的变量只在{}内有效;
//      用let声明的变量，不存在变量提升（var定义变量前使用，值为undefined）。而且要求必须等let声明语句执行完之后，变量才能使用；
//      let不允许在相同作用域内，重复声明同一个变量；
//      var命令和function命令声明的全局变量，依旧是顶层对象的属性；而另一方面，let、const、class声明的全局变量，不属于顶层对象的属性
//             var a = 1;
//                  // 如果在 Node 的 REPL 环境，可以写成 global.a
//                  // 或者采用通用方法，写成 this.a
//             window.a     // 输出1
//             let b = 1;
//             window.b     // 输出undefined

// https://www.cnblogs.com/fly_dragon/p/8669057.html
var a = 99;            // 全局变量a
f();                   // f是函数，虽然定义在调用的后面，但是函数声明会提升到作用域的顶部。
console.log(a);        // a=>99,  此时是全局变量的a

function f() {
    console.log(a);      // 当前的a变量是下面变量a声明提升后，默认值undefined
    var a = 10;
    console.log(a);      // a=>10
}

// pt2:
for (var i = 0; i < 10; i++) {
    console.log(i);
    setTimeout(function() {      // 同步注册回调函数到异步的宏任务队列。
        console.log(i);                 // 执行此代码时，同步代码for循环已经执行完成
    }, 0);
}
// 输出结果：共10个10
// 这里面的知识点： JS的事件循环机制，setTimeout的机制等

// 上面代码中，变量i是var命令声明的，在全局范围内都有效，所以全局只有一个变量i。每一次循环，变量i的值都会发生改变，
// 而循环内的console.log(i)，里面的i指向的就是全局的i。也就是说，所有的i，指向的都是同一个i。

// 而下面代码中，变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量。
// JavaScript引擎内部会记住上一轮循环的值，初始化本轮的变量i时，就在上一轮循环的基础上进行计算。

// i虽然在全局作用域声明，但是在for循环体局部作用域中使用的时候，变量会被固定，不受外界干扰。
for (let i = 0; i < 10; i++) {
    console.log(i);
    setTimeout(function() {
        console.log(i);                 // i是循环体内局部作用域，不受外界影响。
    }, 0);
}
// 输出结果：0 1 2 3 4 5 6 7 8 9

// 以上代码一起运行时，先输出的分别是两个for循环下的console.log()，然后分别输出两个setTimeout()的结果


// for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域：
for (let i = 0; i < 3; i++) {
    let i = 'abc';
    console.log(i);
}


// SpreadJS, getActiveSheet():
// return this.sheets && this.sheets.length > 0 ? this.sheets[this.eq]: H}




