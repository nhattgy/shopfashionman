$(()=> {

  let storageCartItems = JSON.parse(localStorage.getItem('cartItems'));
  let subTotal = 0;
  let total = 0;
  let tax = 0;
  
  // toggle id noitems content show if shooping cart is empty
  storageCartItems ?  $("#noitems").hide() : $("#noitems").show();

  storageCartItems !== null && storageCartItems.forEach((item, index) => {
    $('#cartItems').append(
      `<div class="row border-bottom border-end allItems_cart" id="cartItems_${index}">
        <div class="col-1 py-3 border-end border-start centerItem">
          <i class='bx bx-trash fs-4 text-muted' id="removeItem_${index}"></i>
        </div>
        <div class="col-3 col-md-2 py-3 border-end centerItem">
          <img class="w-75" src="../images/products/${item.id}.webp" alt="product ${item.id}">
        </div>
        <div class="col-2 col-md-3 py-3 border-end centerItem small-md itemNameDiv">
          ${item.itemName} (${item.size})
        </div>
        <div class="col-2 py-3 border-end centerItem itemPriceDiv">
          $${item.price}
        </div>
        <div class="col-2 py-3 border-end qty-div centerItem">
          <div class="centerItem border qty-input-box">
            <input type="text" readonly value=${item.qty} class="border-0 qty-input" id="item_${index}">
            <div class="arrow-btns border-start">
              <i class='bx bxs-up-arrow' id="arrowUpBtn_${index}"></i>
              <i class='bx bxs-down-arrow' id="arrowDownBtn_${index}"></i>
            </div>
          </div>
        </div>
        <div class="col-2 py-3 centerItem" id="innerCartTotal_${index}">
          $${Math.round(item.price * item.qty *100)/100}
        </div>
      </div>`);

      subTotal += (item.price * item.qty);
      subTotal = Math.round (subTotal *100) / 100;
      
      let curQty = $(`#item_${index}`).val();

      // Reuseable Function  Quantity Increment/ Decrement
      const updateQty = (cq)=> {
        storageCartItems[index].qty = cq;
        $(`#item_${index}`).val(cq);
        $(`#innerCartTotal_${index}`).html(`$${Math.round(item.price * cq *100)/100}`);
      };

      // Product Quantity Increment
      $(`#arrowUpBtn_${index}`).click(()=>{
        curQty++;
        updateQty(curQty);
      });
    
      // Product Quantity Decrement
      $(`#arrowDownBtn_${index}`).click((event)=>{
        curQty > 1 ? curQty-- : curQty;
        updateQty(curQty);
      });

      // Remove Cart Item
      $(`#removeItem_${index}`).click((event)=>{
        // Void get current quantity
        let unChangedStorageCartItems = JSON.parse(localStorage.getItem('cartItems'));
  
        $(`#cartItems_${index}`).fadeOut();

        storageCartItems.length === 1 && localStorage.removeItem('cartItems');

        storageCartItems.length > 1 && (
          // remove target array
          storageCartItems.splice(index, 1),
       
          // update localStorage cartItems
          localStorage.setItem('cartItems',  JSON.stringify(storageCartItems))
        )

        // update cart item count
        localStorage.setItem('itemCount', (Number(localStorage.getItem('itemCount') - Number(unChangedStorageCartItems[index].qty))));
        
        location.reload();
      });
  });

  // Update Cart Item
  $('#updateCart').click(()=>{
    if(storageCartItems) {
      // get sum of item count
      const totalItem = storageCartItems.reduce(
        (acc, cur) => acc + cur.qty, 0
      );

      // update localStorage cartItems
      localStorage.setItem('cartItems',  JSON.stringify(storageCartItems));

      // update cart item count
      localStorage.setItem('itemCount', (Number(totalItem)));

      location.reload();
    }else {
      alert("YOUR SHOPPING CART IS EMPTY!");
    }
   
  });

  tax = Math.round(subTotal * 0.08875 *100) / 100;
  total = Math.round((subTotal + tax) *100) / 100;

  // display default $0.00
  subTotal === 0 ? $('#cart-sub').html("$0.00") : $('#cart-sub').html("$" + subTotal);
  subTotal === 0 ? $('#cart-tax').html("$0.00") :  $('#cart-tax').html("$" + tax);
  subTotal === 0 ? $('#cart-total').html("$0.00") :  $('#cart-total').html("$" + total);

  // Clear localStorage
  $('#checkOut').click(()=>{
    confirm('(Demo check out) Emty your cart? ') &&
    (localStorage.removeItem('itemCount'), localStorage.removeItem('cartItems'), location.reload()); 
  });
});