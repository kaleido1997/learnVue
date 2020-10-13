var app = new Vue ({
    el: '#app',
    data: {
        isShow: false
    },
    methods: {
        handleClose() {
            this.isShow = false;
        }
    }
});
