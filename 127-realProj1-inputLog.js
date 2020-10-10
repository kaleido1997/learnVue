function isValueNumber (value) {
    return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(value + '');
    // 判定结果是否为数字，三个括号内分别判定：正负0.0到99999...9.9，正负1到10000...0，正负0
    // 其中，//划定表达式范围，^表示匹配输入的开始，-表示负号，?表示匹配前面一个表达式0次或者1次，[]表示一个字符集合，匹配方括号中的任意字符；
    // +表示匹配前面的表达式1次或多次，\.表示小数点（需用\转义，单个小数点会去匹配除换行符之外的任何单个字符），{n}表示匹配前面一个字符刚好出现了n次，
    // \d表示匹配一个数字，等价于[0-9]；+表示匹配前面的表达式一到多次，$表示匹配输入的结束（即匹配的表达式的边界），
    // |表示逻辑或，*表示匹配前一个表达式0次或多次
    // 正则表达式见https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions
}

Vue.component('input-log', {
    template: '\
        <div class="input-log">\
            <input type="text" v-bind:value="currentValue" @keydown.38="handleUpOne" @keydown.40="handleDownOne" @change="handleChange">\
            <button @click="handleDown" v-bind:disabled="currentValue <= min">-</button>\
            <button @click="handleUp" v-bind:disabled="currentValue >= max">+</button><br/>\
            <span>step: </span><input type="text" v-model="step"><br/>\
        </div>',
    props: {
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        value: {
            type: Number,
            default: 0
        },
        step: {
            type: Number,
            default: 1
        }
    },
    // 一个Vue组件的API只可能来自props、events和slots，需要确定好这3部分的命名和规则
    // 由于Vue组件是单向数据流，所以无法从组件内部直接修改prop中value的值
    // 解决办法也介绍过，就是给组件声明一个data，默认引用value的值，然后在组件内部维护这个data
    data: function () {
        return {
            currentValue: Number(this.value)
        }
    },
    // 但这里的currentValue不会随着value实时更新
    // 为了实现这个功能，我们需要用到一个新的概念：监听(watch)
    // watch选项用来监听某个prop或data的改变，当它们发生变化时，就会触发watch配置的函数，从而完成我们的业务逻辑
    // 在本例中，我们要监听两个量：value和currentValue。监听value是要知晓从父组件修改了value，监听currentValue是为了当currentValue改变时，更新value
    watch: {
        currentValue: function (val) {
            this.$emit('input', val);
            this.$emit('on-change', val);       //emit和v-on对应的事件名最好使用kebab-case
            // 监听currentValue的回调里，this.$emit('input', val)是在使用v-model时改变value的，
            // this.$emit('on-change', val）是触发自定义事件on-change，用于告知父组件数字输入框的值有所改变（这里没有使用该事件）
        },
        value: function (val) {
            this.updateValue(val);
        }
    },
    methods: {
        handleChange(event) {
            var val = event.target.value.trim();
            var min = this.min;
            var max = this.max;

            if (isValueNumber(val)) {
                val = Number(val);
                this.currentValue = val;

                if (val > max) {
                    this.currentValue = max;
                } else if (val < min) {
                    this.currentValue = min;
                }
            } else {
                event.target.value = this.currentValue;
            }
        },
        // 这里绑定的currentValue也是单向数据流，并没有用v-model，所以在输入时，currentValue的值并没有实时改变
        // 如果输入的不是数字（比如英文和汉字等），就将输入的内容重置为之前的currentValue
        // 如果输入的是符合要求的数字，就把输入的值赋给currentValue
        updateValue(val) {
            if (val > this.max) val = this.max;
            if (val < this.min) val = this.min;
            this.currentValue = val;
        },
        handleUp() {
            if (this.currentValue >= this.max) return;
            this.currentValue += Number(this.step);
        },
        handleUpOne() {
            if (this.currentValue >= this.max) return;
            this.currentValue += 1;
        },
        handleDown() {
            if (this.currentValue <= this.min) return;
            this.currentValue -= Number(this.step);
        },
        handleDownOne() {
            if (this.currentValue <= this.min) return;
            this.currentValue -= 1;
        }
        // 从父组件传递过来的value有可能是不符合当前条件的（大于max或小于min），所以在methods里写了一个方法updateValue，用来过滤出一个正确的currentValue
    },
    mounted: function () {
        this.updateValue(this.value);
    }
});
