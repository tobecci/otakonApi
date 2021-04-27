function funcA(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let msg = "waited for 5 secs"
            console.log(msg);
            resolve(msg);
        }, 5000);
    })
}


function funcB(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("waited for 2 secs");
        }, 2000)
    })
}

funcA()
.then((data) => {
    console.log({data:data});
    funcB();
})

// funcA();
// funcB();
