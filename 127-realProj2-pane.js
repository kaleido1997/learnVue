Vue.component('pane', {
    name: 'pane',
    template: '\
        <div class="pane" v-show="isShow">\
            <slot></slot>\
        </div>',
    data: function () {
        return {
            isShow: true
        }
    },
    // 既然要点击对应的标签页标题按钮，那应该有一个唯一的值来标识这个pane，我们可以设置一个prop: name让用户来设置，但它不是必需的，
    // 如果使用者不设置，可以默认从0开始自动设置，这步操作仍然是tabs执行的，因为pane本身并不知道自己是第几个。
    // 除了name，还需要标签页标题的prop: label，tabs组件需要将它显示在标签页标题。
    props: {
        name: String,
        label: {
            type: String,
            default: ''
        }
    },
    // 上面的prop: label用户是可以动态调整的，所以在pane初始化及label更新时，都要通知父组件也更新。
    // 因为是独立组件，可以直接通过this.$parent访问tabs组件的实例来调用它的方法更新标题，该方法名暂定为updateNav。
    // 注意，在业务中尽可能不要使用$parent来操作父链，这种方法仅适合于标签页这样的独立组件。
    methods: {
        updateNav() {
            this.$parent.updateNav();
        }
    },
    watch: {
        label: function () {
            this.updateNav();
        }
    },
    mounted() {
        this.updateNav();
    }
})
