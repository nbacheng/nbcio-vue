class Tools {
  /**
   * 数组转化为 tree
   * @param list list
   * @param parentId parentId
   * @return {*} 结果
   */
  static list2tree = (list, parentId, render) => {
    let menuObj = {};
    let arr = [];
    list.forEach(item => {
      let obj = {
        id: item.id,
        title: item.name,
        expand: true,
        parentId: item.parentId,
        children: []
      };
      menuObj[item.id] = obj;
      arr.push(obj);
    });
    return arr.filter(item => {
      if (item.parentId !== parentId) {
        menuObj[item.parentId].render = render;
        menuObj[item.parentId].expand = false;
        menuObj[item.parentId].children.push(item);
        return false;
      }
      return true;
    });
  };
}

export default Tools;
