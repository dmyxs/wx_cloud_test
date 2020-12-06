// var productObj = require('product-model.js');

// import {Product} from 'product-model.js';
// import {Cart} from '../cart/cart-model.js';

// var product=new Product();  //实例化 商品详情 对象
// var cart=new Cart();

const db = wx.cloud.database()
let id = ''
Page({
    data: {
        swiperCurrentIndex:0,
        loadingHidden:false,
        hiddenSmallImg:true,
        countsArray:[1,2,3,4,5,6,7,8,9,10],
        productCounts:1,
        currentTabsIndex:0,
        cartTotalCounts:0,
        product:{}
    },
    onLoad: function (option) {
        id = option.id;
        this._loadData(id);
        this._cartAllCount()
    },

    onSweiperChange(e){
        this.setData({
          swiperCurrentIndex:e.detail.current
        })
    },
    
    /*加载所有数据*/
    _loadData:function(id){
        wx.showLoading({
          title: '加载中',
        })

        db.collection('goods').where({
          _id:id
        }).get().then(res => {
          this.setData({
            product:res.data[0]
          },() => {
            wx.hideLoading()
          })
        })

        





        // var that = this;
        // product.getDetailInfo(this.data.id,(data)=>{
        //     that.setData({
        //         cartTotalCounts:cart.getCartTotalCounts().counts1,
        //         product:data,
        //         loadingHidden:true
        //     });
        //     callback&& callback();
        // });
    },

    _cartAllCount(){
        const cartData = this._getDataFromLocal()
        if(!cartData){
            return
        }
        const count = cartData.reduce((p,c) => p += c['count'],0)
        this.setData({
            cartTotalCounts:count
        })
    },

    //选择购买数目
    bindPickerChange: function(e) {
        this.setData({
            productCounts: this.data.countsArray[e.detail.value],
        })
    },

    //切换详情面板
    onTabsItemTap:function(e){
        var index = e.currentTarget.dataset.index
        this.setData({
            currentTabsIndex:index
        });
    },

    /*添加到购物车*/
    onAddingToCartTap:function(events){
        //防止快速点击
        if(this.data.isFly){
            return;
        }
        this.addToCart(this.data.productCounts);
        this._flyToCartEffect(events);
    },

    /*将商品数据添加到内存中*/
    addToCart:function(count){
        // let targetObj={}
        // let keys = ['_id','name','imgurl','price'];
        // for(var key in this.data.product){
        //     if(keys.indexOf(key)>=0){
        //       targetObj[key] = this.data.product[key];
        //     }
        // }
        const product = this.data.product
        if(product.stock == 0){
            wx.showToast({
              title: '该产品已缺货',
              icon:'none',
              duration:3000
            })
            return
        }

        const cartData = this._getDataFromLocal()

        const isHasIndex = this._isHasData(id,cartData)
        if(isHasIndex == -1){
          const data = {
            ...product,
            count:count,
            selectStatus:true
          }
          cartData.push(data)
        }else{
          cartData[isHasIndex].count += count
        }
        wx.setStorageSync('cart', cartData)
      
        // cart.add(targetObj,this.data.productCounts);
    },


    _getDataFromLocal(){
      return wx.getStorageSync('cart') || []
    },

    _isHasData(id, cartData){
      for (let i = 0; i < cartData.length; i++) {
        if(cartData[i]._id == id){
          return i
        }
      }
      return -1
    },

    /*加入购物车动效*/
    _flyToCartEffect:function(events){
        const product = this.data.product
        if(product.stock == 0){
            wx.showToast({
              title: '该产品已缺货',
              icon:'none',
              duration:3000
            })
            return
        }


        //获得当前点击的位置，距离可视区域左上角
        var touches=events.touches[0];
        var diff={
                x:'25px',
                y:25-touches.clientY+'px'
            },
            style='display: block;-webkit-transform:translate('+diff.x+','+diff.y+') rotate(350deg) scale(0)';  //移动距离
        this.setData({
            isFly:true,
            translateStyle:style
        });
        var that=this;
        setTimeout(()=>{
            that.setData({
                isFly:false,
                translateStyle:'-webkit-transform: none;',  //恢复到最初状态
                isShake:true,
            });
            setTimeout(()=>{
                var counts=that.data.cartTotalCounts+that.data.productCounts;
                that.setData({
                    isShake:false,
                    cartTotalCounts:counts
                });
            },200);
        },1000);
    },

    /*跳转到购物车*/
    onCartTap:function(){
        wx.navigateTo({
          url: '../shopping-cart/index',
        });
    },

    /*下拉刷新页面*/
    onPullDownRefresh: function(){
        this._loadData(()=>{
            wx.stopPullDownRefresh()
        });
    },

    //分享效果
    onShareAppMessage: function () {
        return {
            title: '零食商贩 Pretty Vendor',
            path: 'pages/product/product?id=' + this.data.id
        }
    }

})


