<!--<template>-->
<!--  <div id="app">-->
<!--    <h1>Hello World {{value}}</h1>-->
<!--  </div>-->
<!--</template>-->

<!--&lt;!&ndash;<script src="https://unpkg.com/vue/dist/vue.min.js"></script>&ndash;&gt;-->
<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      timer: '',-->
<!--      value: 0-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    get() {-->
<!--      this.value ++;-->
<!--      console.log(this.value);-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.timer = setInterval(this.get, 1000);-->
<!--  },-->
<!--  beforeDestroy() {-->
<!--    clearInterval(this.timer);-->
<!--  }-->
<!--};-->
<!--</script>-->


<template>
  <div id="app" >
    {{ timeDate | formatDate }}
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return{
      timeDate: new Date()
    };
  },
  filters: { //filters专门用于文本格式化，与上面带‘|’语句配合使用
    formatDate: function(value) {
      var fillDate = function(val){ //在数字前，不够10则补0
        return val < 10 ? '0' + val : val;
      };
      var date = new Date(value);
      var year = date.getFullYear();
      var month = fillDate(date.getMonth() + 1);
      var day= fillDate(date.getDate());
      var hours= fillDate(date.getHours());
      var minutes = fillDate(date.getMinutes());
      var seconds = fillDate(date.getSeconds());
      return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
    }
  },
  mounted() {
    var _this = this;     // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function(){
      _this.timeDate = new Date();
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer){
      clearInterval(this.timer);
    }
  }
};
</script>
