<template>
  <div id="app" >
    {{ timeDate | formatDate }}
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return{
      timeDate: new Date()
    };
  },
  filters: { //filters专门用于文本格式化，与上面带‘|’语句配合使用
    formatDate: function(value) {
      var fillDate = function(value){ //在数字前，不够10则补0
        return value < 10 ? '0' + value : value;
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
    var _this = this;
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
