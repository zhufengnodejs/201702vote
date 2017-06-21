let arr = [{id:1},{id:2}];
let arr2 = arr.map(item=>`<li>${item.id}</li>`);
console.log(arr2);
let arr3 = arr2.join('');
console.log(arr3);