var app = new Vue ({
    el: '#app',
    data: {
        allChecked: false,
        productList: [
            {
                id: '1',
                name: 'iPhone',
                price: '1234',
                count: 1,
                isChecked: false
            },
            {
                id: '2',
                name: 'iPad',
                price: '2345',
                count: 1,
                isChecked: false
            },
            {
                id: '3',
                name: 'iMac',
                price: '3456',
                count: 1,
                isChecked: false
            }
        ]
    },
    computed: {
        // 总价totalPrice是依赖于商品列表而动态变化的，所以用计算属性来实现
        totalPrice() {
            var total = 0;
            for (var i = 0; i < this.productList.length; i++) {
                var item = this.productList[i];
                if (item.isChecked) {
                    total += item.price * item.count;
                }
            }
            return total != 0 ? total.toString().replace(/\B(?=(\d{3})+$)/g, ',') : 0;
            // 将结果转换为带有“千位分隔符”的数字，注意加对0的判定
            // 其中，//划定表达式范围，\B表示匹配非单词边界（无限制的界），x(?=y)表示匹配x仅当x后面跟着y，\d表示匹配一个数字，
            // {x}表示匹配了前面一个字符刚好出现x次，+表示匹配前面的表达式一到多次，$表示匹配输入的结束（即匹配的表达式的边界），g表示全局搜索（见高级搜索）
            // 正则表达式见https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions
        }
    },
    methods: {
        toReduce(index) {
            if (this.productList[index].count === 1)
                return;
            this.productList[index].count--;
        },  //虽然在button上己经绑定了disabled特性，但是在toReduce()内又判断了一遍，这是因为在某些时候，可能不一定会用button元素，
            //也可能是div、span等，给它们增加disabled是没有任何作用的，所以为了安全起见，在业务逻辑/methods中再判断一次。
        toAdd(index) {
            this.productList[index].count++;
        },
        toRemove(index) {
            this.productList.splice(index, 1);
        },
        changeCheck(index) {
            this.productList[index].isChecked = !this.productList[index].isChecked;
            var flagAll = true;
            for (var i = 0; i < this.productList.length; i++) {
                if (!this.productList[i].isChecked) {
                    flagAll = false;
                }
            }
            this.allChecked = flagAll;
        },
        changeAllCheck() {
            this.allChecked = !this.allChecked;  // !表示取反
            if (this.allChecked) {
                for (var i = 0; i < this.productList.length; i++) {
                    this.productList[i].isChecked = true;
                }
            }
            else {
                for (var i = 0; i < this.productList.length; i++) {
                    this.productList[i].isChecked = false;
                }
            }
        }
    }
})
