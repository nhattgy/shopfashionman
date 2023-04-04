$(() => {
  
  // Append products
  const star ="<i class='bx bxs-star'></i>";
  const getItems= (data, categories) => {
    data.forEach(item => {
      $(`#${categories}`).append(
        `<div class="product-items col-xl-3 col-md-4 col-sm-12 p-lg-4 mb-lg-3 mb-5 px-sm-3 px-5"> 
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
          <div class="h6 p-0 m-0" id="stars">
            <p class="py-1 m-0 muted">${star}${star}${star}${star}${star}</p>
          </div>
          <div class="p-0 m-0">
            <span>$${item.price}</span>
          </div>         
        </div>`
      );
    });
  };
  
  $.getJSON('../../script/products.json',function(data){
    $.each(data,(i,items)=>{
      // call getItems function pass array and categories
      getItems(items.accessories, "accessories");
      getItems(items.bottoms, "bottoms");
      getItems(items.shoes, "shoes");
      getItems(items.tops, "tops");
    })
  });  

});