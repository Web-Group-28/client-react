var tmpState = new Set(['button_1', 'button_2']);
console.log("CLICK BEFORE:", tmpState);
if (true) {
   tmpState.delete(`button_1`);
   console.log("CLICK AFTER:", tmpState);
} else {
   tmpState.add(`button_1`);
   console.log("CLICK AFTER:", tmpState);
}
