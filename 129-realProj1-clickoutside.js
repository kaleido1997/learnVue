Vue.directive('clickoutside', {
    bind: function (el, binding, vnode) {
        function documentHandler (event) {
            if (el.contains(event.target)) {    // contains函数用来判断html元素A是否包含了html元素B <div id="A"> <div id="B"></div> </div>
                return false;
            }
            if (binding.expression) {
                binding.value(event);
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind: function (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;      // 如果不移除，当组件或元素销毁时，对document的click事件监听仍然存在于内存中。
    }
});

// 因为要在document上绑定click事件，所以在bind钩子内声明了一个函数documentHandler，并将它作为句柄绑定在document的click事件上。
// documentHandler函数做了两个判断，第一个是判断点击的区域是否是指令所在的元素内部，如果是，就跳出函数，不往下继续执行；
// 第二个判断的是当前的指令v-clickoutside有没有写表达式，在该自定义指令中，表达式应该是一个函数，
// 在过滤了内部元素后，点击外面任何区域应该执行用户表达式中的函数，所以binding.value()就是用来执行当前上下文methods中指定的函数的。
