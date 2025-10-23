"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depthToDivChild = exports.widthToDivChild = void 0;
function widthToDivChild(productWidth) {
    let divProduct;
    console.log(productWidth);
    switch (productWidth) {
        case "50":
            divProduct = 1;
            break;
        case "100":
            divProduct = 2;
            break;
        default:
            divProduct = 0;
            break;
    }
    return divProduct;
}
exports.widthToDivChild = widthToDivChild;
function depthToDivChild(productDepth) {
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
            divProduct = 0;
            break;
    }
    return divProduct;
}
exports.depthToDivChild = depthToDivChild;
