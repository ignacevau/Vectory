import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

export const bus = new Vue();

export class Action {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

export class Layer {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

export class ShapeGroup {
  constructor(children) {
    this.children = children;
    this.selectable = true;
    this.type = 'group';
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')