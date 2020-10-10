// 技术难点：
// 使用了组件嵌套的方式，将一系列pane组件作为tabs组件的slot；
// tabs组件和pane组件通信上，使用了$parent和$children的方法访问父链和子链；
// 定义了prop: value和data: currentValue，使用$emit('input')来实现v-model的用法。

Vue.component('tabs', {
    template: '\
        <div class="tabs">\
            <div class="tabs-bar">\
                <div v-bind:class="tabClass(item)" v-for="(item, index) in navList" @click="handleChange(index)">\
                    {{ item.label }} <hr>\
                    <span v-if="ifClose(item)" @click="deleteTab(index, event)">xxxx</span>\
                </div>\
                <h1 v-if="ifNoTab()">No Available Tab!</h1>\
            </div>\
            <div class="tabs-content">\
                <slot></slot>\
                <!-- 这里的slot就是嵌套的pane -->\
            </div>\
        </div>',
    props: {
        value: [String, Number]             // 这里的value（activeKey）是为了可以使用v-model；用中括号可为一个变量声明多个类型
    },
    data: function () {
        return {
            currentValue: this.value,       // 因为不能修改value，所以复制一份自己维护
            navList: []                     // 渲染tabs的标题
        }
    },
    methods: {
        ifNoTab() {
            return this.navList.length === 0;
        },
        ifClose(item) {
            return item.closable == 'true';
        },
        deleteTab(index, event) {
            // this.navList.splice(index, 1);   // 若不加判定直接splice，最终tab全被关闭后页面上依然留存最后一个开启的tab的内容
            if(this.navList[index].name === this.currentValue){
                if(index > 0){
                    this.currentValue = this.navList[index - 1].name;   // 页面关闭后自动跳转到前一个tab
                    this.navList.splice(index, 1);
                    event.stopPropagation();    // 阻止冒泡，避免触发handleChange(index)方法
                }
                else{
                    this.navList.splice(index, 1);
                    event.stopPropagation();
                    if(this.navList.length > 0){
                        this.currentValue = this.navList[0].name;       // 若关闭的是第一个页面，则跳转至关后的第一个页面
                    }
                    else{
                        this.currentValue = '';
                    }
                }
            }
            else{
                this.navList.splice(index, 1);  // 若关闭的为其他页面，则当前curVal不变
                event.stopPropagation();
                if(this.navList.length === 0){
                    this.currentValue = '';
                }
            }
        },
        tabClass(item) {        // 给当前选中的tab加一个class，便于套用不同的css样式
            return ['tabs-tab', { 'tabs-tab-active': item.name === this.currentValue }]
        },
        handleChange(index) {   // 点击tab时触发
            var nav = this.navList[index];
            var name = nav.name;
            this.currentValue = name;             // 改变当前in选中的tab，并触发之后的watch
            this.$emit('input', name);      // 更新value，实现v-model的用法
            // 这里@input事件为自带事件，与@click、@change等类似；不同之处在于@input在元素值发生变化立即触发，@change在元素失去焦点时触发
            this.$emit('on-click', name);   // 触发自定义事件on-click（这里并未定义该事件），供父级使用
        },
        getTabs() {
            // 遍历子组件，得到所有的pane组件
            return this.$children.filter(function (item) {
                return item.$options.name === 'pane';
            })
        },
        updateNav() {
            this.navList = [];
            var _this = this;
            // 在methods里使用了有function回调的方法时（例如遍历数组的方法forEach)，
            // 回调内的this不再执行当前的Vue实例，也就是tabs组件本身，
            // 所以要在外层设置一个_this = this的局部变量来间接使用this。

            this.getTabs().forEach(function (pane, index) {
                _this.navList.push({
                    label: pane.label,
                    name: pane.name || index,
                    closable: pane.closable
                });
                // 如果没有给pane设置name，则默认设置它的索引
                if (!pane.name) pane.name = index;
                // ↓设置当前选中的tab的索引（即pane的name）
                if (index === 0) {
                    if (!_this.currentValue) {
                        _this.currentValue = pane.name || index;
                    }
                    // 设置currentValue来标识当前选中的pane的name
                }
            });

            this.updateStatus();
        },
        updateStatus() {
            var tabs = this.getTabs();
            var _this = this;
            // 显示当前选中的tab对应的pane组件，隐藏没有选中的
            tabs.forEach(function (tab) {
                return tab.isShow = tab.name === _this.currentValue;
            })
        },
    },
    watch: {
        value: function (val) {
            this.currentValue = val;
        },
        currentValue: function () {
            this.updateStatus();    // 在当前选中的tab发生变化时，更新pane的显示状态
        }
    }
})
