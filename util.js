export function generateFibonacci(n){
    if(n<=0)return [];
    if(n==1)return [0];
    const fib = [0,1];
    for(let i=2;i<n;i++){
        fib.push(fib[i-1]+fib[i-2]);
    }
    return fib;
}

export function filterPrimes(arr){
    return arr.filter(num=>{
        if(num<=1)return false;
        for(let i=2;i<=Math.sqrt(num);i++){
            if(num%i===0)return false;
        }
        return true;
    });
}

function gcd(a,b){
    while(b!==0){
        const temp=b;
        b=a%b;
        a=temp;
    }
    return a;
}
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

export function computeLCM(arr){
    if(arr.length===0) return 1;
    if(arr.length===1)return arr[0];
    return arr.reduce((acc,num)=>lcm(acc,num));
}

export function computeHCF(arr){
    if(arr.length===0)return 1;
    if(arr.length===1)return arr[0];
    return arr.reduce((acc,num)=>gcd(acc,num));
}