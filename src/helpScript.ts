export function widthToDivChild(productWidth:string){
  let divProduct;
  console.log(productWidth);
  switch(productWidth){
    case "50": divProduct=1;break;
    case "100": divProduct=2;break;
    default: divProduct=0;break;
  }

return divProduct;
}

export function depthToDivChild(productDepth: string) {
  console.log(productDepth);
  let divProduct;
  switch (productDepth) {
    case "30":
      divProduct = 1;
      break;
    case "60":
      divProduct = 2;
      break;
    default:
      divProduct = 0;break;
  }

  return divProduct;
}
