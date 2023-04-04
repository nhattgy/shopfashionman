$(()=> {

  // intit swiper
  let swiper;
  swiper = new Swiper(".SwiperSetting", {
    slidesPerView: 2,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      '@1.25': {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      '@1.50': {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      '@1.75': {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    }
  });

  // Get url parmas
  const urlParams = new URLSearchParams(window.location.search);
  const product_id = urlParams.get('product_id');

  // Get categories
  let categories 
  switch(product_id[0]) {
    case "a":
      categories = "Accessories";
      break;
    case "b":
      categories = "Bottoms";
      break;
    case "s":
      categories = "Shoes";
      break;
    case "t":
      categories = "Tops";
      break;
    default:
      categories = null;
  };

  // Get all items
  $.getJSON('../../script/products.json',(data) =>{
    $.each(data,(i,items)=>{
    
    let allItems = [];
    allItems.push(
      ...items.accessories, 
      ...items.bottoms, 
      ...items.shoes,
      ...items.tops
    )
  
    // Find match item base on id
    const matchItem = allItems.filter(item => {
      return item.id === product_id;
    });

    // Find related items
    const relatedProducts = allItems.filter(item => {
      return item.id !== product_id && item.id[0] === product_id[0];
    });

    const itemName = matchItem[0].itemName.replace(/_/g," ");
    const itemPrice =  matchItem[0].price;
    const descriptionData = matchItem[0].description;
    
    // Html
    $('title').text (`Shop ${categories} - ${itemName}`); 
    $('#bannerText').text(categories);
    $('#itemName').html(`<p class="fs-5 fw-bold">${itemName}</p>`);
    $('#detailPrice').html( `<span>USD$${itemPrice}</span>`);
    $('#detailImg').html(`<img class="img-fluid shadow" src="../../images/products/${matchItem[0].id}.webp" alt="product image">`);
    $('#descriptionDiv').html(
      `<p class="fw-bold pt-3">Description:</p><hr>
        <div id="descriptionsWrap"></div>`);
    $('#itemSizeOptions').html(
      `<span class="fw-bold pt-3">Size:</span> 
        <div class="sizeContainer">
        <div class="sizeOptions">
          <input checked type="radio" name="sizeOptions" value="S" id="size_s">
          <label for="size_s">S</label>
        </div>
        <div class="sizeOptions">
          <input type="radio" name="sizeOptions" value="M" id="size_m">
          <label for="size_m">M</label>
        </div>
        <div class="sizeOptions">
          <input type="radio" name="sizeOptions" value="L" id="size_l">
          <label for="size_l">L</label>
        </div>
        <div class="sizeOptions">
          <input type="radio" name="sizeOptions" value="XL" id="size_xl">
          <label for="size_xl">XL</label>
        </div>
      </div>`);
    $('#itemQty').html(
      `<div class="quantity">
        <button type="button" name="btnMinus" id="btnMinus">
          <i class='bx bx-minus'></i>
        </button>
        <input type="number" name="quantity" id="qty" disabled value="1">
        <button type="button" name="btnPlus" id="btnPlus">
          <i class='bx bx-plus'></i>
        </button>
      </div>`);  
    $('#detailAddBtn').html(`<button id="addCartBtn">ADD TO BAG</button>`);

    const star ="<i class='bx bxs-star'></i>";
    
    const getItems= (data) => {
      data.forEach(item => {
        $('#relatedProducts').append(
          `<div class="swiper-slide col-2 p-2" style="color: #222;"> 
              <div class="product-img-layer">
                <img class="img-fluid shadow" src="../../images/products/${item.id}.webp" alt="product image">
                <a href="../../pages/shops/productDetails.html?product_id=${item.id}">
                  <div id="productHoverEffect">
                  </div>
                 </a>
              </div>
            </a>
            <div class="pt-2 pb-0 m-0 w-100 text-truncate">
              <a class="linksColor link-secondary fs-6 text-decoration-none" href="../../pages/shops/productDetails.html?product_id=${item.id}">${(item.itemName).replace(/_/g," ")}</a> 
            </div>
            <div class="h6 p-0 m-0">
              <p class="py-1 m-0">${star}${star}${star}${star}${star}</p>
            </div>
            <div class="p-0 m-0">
              <span>$${item.price}</span>
            </div>         
          </div>`
        );
      });
    };
    getItems(relatedProducts);

    // Render description objects 
    Object.entries(descriptionData).forEach(([key, value]) => {
      $('#descriptionsWrap')
      .append(
        $(`<div class="description-table">
            <div class="desKey">${key.replace(/_/g," ")}:</div>
            <div class="desVal">${value.replace(/_/g," ")}</span>
          </div>`)
      );
    });

    let selectedSize = "S";
    // Toggle size options
    $('.sizeOptions').click(()=>{

      // Save selected size
      selectedSize = $('input[type="radio"]:checked')[0].defaultValue;
      let radio = $(this);

      if (radio.data('waschecked') == true){
        radio.prop('checked', false);
        radio.data('waschecked', false);
      }else {
        radio.data('waschecked', true);
      }
      // clear other options
      radio.siblings('input[type="radio"]').data('waschecked', false);
    });

    // Decrement button
    $( '#btnMinus' ).on( "click", ()=> {
      if($('#qty').val() >= 2){
        $('#qty').get(0).value--; 
      }
    });

    // Increment button
    $( '#btnPlus' ).on( "click", ()=> {
      $('#qty').get(0).value++ 
    });

    // Add Cart Button handler
    $("#addCartBtn").click((event) =>{
      event.preventDefault();
      let localStorageCartItem = JSON.parse(localStorage.getItem('cartItems'));
      let itemExist = false;
      let itemCount = $('.count');
      let newItemObj =  {
        "id": product_id,
        "itemName": itemName,
        "size": selectedSize,
        "qty": Number($('#qty').val()),
        "price":itemPrice,
      };

      // If there is items store in localStorage
      if(localStorageCartItem) {
        // Check if item already exist (if exist and same Size update qty)
        localStorageCartItem.forEach((item, i)=> {
          (item.id === newItemObj.id && item.size === newItemObj.size)&&
          (localStorageCartItem[i].qty = newItemObj.qty + item.qty , itemExist= true);
        })

        // save to localStorage cartItems
        itemExist ? localStorage.setItem('cartItems',  JSON.stringify(localStorageCartItem))
        :localStorage.setItem('cartItems',  JSON.stringify([newItemObj, ...localStorageCartItem]))
        
        // get item total count
        let localStorageItemCount;
        localStorage.getItem('itemCount') ? localStorageItemCount = localStorage.getItem('itemCount') : localStorageItemCount=0;
        localStorageItemCount = Number(localStorageItemCount) + Number($('#qty').val());
    
        // update total count 
        localStorage.setItem('itemCount', localStorageItemCount);

      // There is no item store in localStorage
      }else {
        localStorage.setItem('cartItems',  JSON.stringify([newItemObj]));
        localStorage.setItem('itemCount', Number($('#qty').val()));
      }
      
      // Update Html for number of items
      itemCount.text(localStorage.getItem('itemCount'));

      // Reset size and qty 
      $('input[type="radio"]')[0].checked = true;
      $('#qty').get(0).value = "1";

      // Scroll to top
      window.scrollTo(0, 0);

      // Notication for item added 
      Toastify({
        text: "New items has been added to your cart",
        avatar: "../../images/checked.png",
        destination: "../cart.html",
        duration: 2500,
        style: {
          background: "#000000",
          color: "#eee",
          border: "2px solid #eee",
          boxShadow: "2px 4px 5px rgba(0,0,0,.1)"
      }
      }).showToast();
    });

    });
  });
});