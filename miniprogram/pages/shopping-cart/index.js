// var CartObj = require('cart-model.js');

// import {Cart} from 'cart-model.js';

// var cart=new Cart(); //实例化 购物车
var x1=0;
var x2=0;

Page({
    data: {
        loadingHidden:false,
        selectedCounts:0, //总的商品数
        selectedTypeCounts:0, //总的商品类型数
        account:0,
        cartData:[],
    },

    onLoad: function () {},

    /*
     * 页面重新渲染，包括第一次，和onload方法没有直接关系
     */
    onShow:function(){
        const cartData = wx.getStorageSync('cart')
        const countsInfo = this._getCartTotalCounts()

        this.setData({
            selectedCounts:countsInfo.counts1,
            selectedTypeCounts:countsInfo.counts2,
            account: this._calcTotalAccountAndCounts(cartData).account,
            loadingHidden:true,
            cartData:cartData
        })

        // var cartData=cart.getCartDataFromLocal(),
        //     countsInfo=cart.getCartTotalCounts(true);
        // this.setData({
            // selectedCounts:countsInfo.counts1,
            // selectedTypeCounts:countsInfo.counts2,
            // account:this._calcTotalAccountAndCounts(cartData).account,
            // loadingHidden:true,
            // cartData:cartData
        // });
    },

    /*离开页面时，更新本地缓存*/
    onHide:function(){
      console.log('hide');
        
      wx.setStorageSync('cart', this.data.cartData)
    },

    
    /*调整商品数目*/
    onHandleDataCount:function(e){
        const id = e.currentTarget.dataset.id
        const type = e.currentTarget.dataset.type
        const index = this._getProductIndexById(id)
        this._changeCounts(index,type)

        
        // var id=cart.getDataSet(event,'id'),
        //     type=cart.getDataSet(event,'type'),
        //     index=this._getProductIndexById(id),
        //     counts=1;
        // if(type=='add') {
        //     cart.addCounts(id);
        // }else{
        //     counts=-1;
        //     cart.cutCounts(id);
        // }
        // //更新商品页面
        // this.data.cartData[index].counts+=counts;
        // this._resetCartData();
    },
    _changeCounts(index,type){
        const cartData = this.data.cartData
        if(type =='add') {
            cartData[index].count += 1
        }else{
            if(cartData[index].count > 1){
                cartData[index].count -= 1
            }else{
                this.onRemoveBycount(index)
            }
        }
        this._resetCartData();
    },


    //删除商品
    onRemove:function(event){
        wx.showModal({
            title: '提示',
            content: '是否要删除商品？',
            success: (res) => {
                if (res.confirm) {
                    const id = e.currentTarget.dataset.id
                    const index = this._getProductIndexById(id)
                    this.data.cartData.splice(index,1);
                    this._resetCartData();
                } 
            }
        }) 
    },
    onRemoveBycount(index){
        wx.showModal({
            title: '提示',
            content: '是否要删除商品？',
            success: (res) => {
                if (res.confirm) {
                    this.data.cartData.splice(index,1);
                    this._resetCartData();
                } 
            }
        }) 
    },

    //选择商品
    toggleSelect:function(e){
        const id = e.currentTarget.dataset.id
        const status = e.currentTarget.dataset.status
        const index = this._getProductIndexById(id)
        if(index != -1){
            this.data.cartData[index].selectStatus = !status;
        }
        this._resetCartData()
        

        // var id=cart.getDataSet(event,'id'),
        //     status=cart.getDataSet(event,'status'),
        //     index=this._getProductIndexById(id);
        // this.data.cartData[index].selectStatus=!status;
        // this._resetCartData();
    },
    //全选
    toggleSelectAll:function(e){
        // const res = cartData.every((item) => item.selectStatus == true)
        // console.log(res);
        
        // 逻辑：只要有一个为true，就全选为true，全部为true时，全选为false
        const cartData = this.data.cartData
        const isAll = cartData.every((item) => item.selectStatus == true)
        cartData.forEach((item) => {
            if(isAll){
                item.selectStatus = false
            }else{
                item.selectStatus = true
            }
        })
        this.setData({
            cartData:cartData
        })
        this._resetCartData();
        
        // var status = e.currentTarget.dataset.status == 'true';
        // var data = this.data.cartData,
        //     len=data.length;
        // for(let i=0;i<len;i++) {
        //     data[i].selectStatus=!status;
        // }
        // this._resetCartData();
    },

    //查看商品详情
    onProductsItemTap:function(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../shopping-detail/index?id=' + id
        })
    },


    //提交订单
    submitOrder:function(){
        wx.navigateTo({
            url:'../order/index?account='+this.data.account+'&from=cart'
        });
    },

    

    //根据商品id得到 商品所在下标
    _getProductIndexById:function(id){
        const cartData = this.data.cartData
        return cartData.findIndex((item) => item._id == id)

        // var data=this.data.cartData,
        //     len=data.length;
        // for(let i=0;i<len;i++){
        //     if(data[i].id==id){
        //         return i;
        //     }
        // }
    },

    //更新购物车商品数据
    _resetCartData:function(){
        const newData = this._calcTotalAccountAndCounts(this.data.cartData);  /*重新计算总金额和商品总数*/
        this.setData({
            account: newData.account,
            selectedCounts: newData.selectedCounts,
            selectedTypeCounts: newData.selectedTypeCounts,
            cartData: this.data.cartData
        });
    },

    //计算总金额和选择的商品总数
    _calcTotalAccountAndCounts:function(data){
        let length = data.length
        let account = 0
        let selectedCounts = 0
        let selectedTypeCounts = 0
        let multiple = 100;

        for(let i = 0; i < length; i++){
            //避免 0.05 + 0.01 = 0.060 000 000 000 000 005 的问题，乘以 100 *100
            if(data[i].selectStatus) {
                account += data[i].count * multiple *  Number(data[i].price) * multiple;
                selectedCounts += data[i].count;
                selectedTypeCounts++;
            }
        }
        return{
            selectedCounts:selectedCounts,
            selectedTypeCounts:selectedTypeCounts,
            account:account/(multiple*multiple)
        }
    },

    _getCartTotalCounts(flag){
        const cartData = wx.getStorageSync('cart')
        let counts1 = 0
        let counts2 = 0

        for(let i = 0; i < cartData.length; i++){
            if (flag){
                if(cartData[i].selectStatus) {
                    counts1 += cartData[i].count;
                    counts2++;
                }
            }else{
                counts1 += cartData[i].count;
                counts2++;
            }
        }
        return {
            counts1:counts1,
            counts2:counts2
        };
    }

})