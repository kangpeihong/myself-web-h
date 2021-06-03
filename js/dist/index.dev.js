"use strict";

/* 
TODO: 获取nav列表
*/
function getNavList() {
  $.ajax({
    type: 'GET',
    url: '../assets/nav.json',
    dataType: 'json',
    success: function success(data) {
      console.log('data', data);
      var str = '';
      var child = '';
      data.navList.forEach(function (element) {
        if (element.children && element.children.length > 0) {
          str += "<li>\n          <span>".concat(element.name, "</span>\n          <ul class=\"hover-box\"></ul>\n        </li>");
          element.children.forEach(function (item) {
            child += "<li>".concat(item.name, "</li>");
          });
        } else {
          str += "<li>\n          <span>".concat(element.name, "</span>\n        </li>");
        }
      });
      $('.nav-list').append(str);
      $('.hover-box').append(child);
      navHover();
    }
  });
}

function navHover() {
  $('.nav-list>li').hover(function () {
    $(this).addClass('nav-hover');
    $('.hover-box').eq($(this).index()).addClass('active');
    $('.hover-box').eq($(this).index()).addClass('animate__animated');
    $('.hover-box').eq($(this).index()).addClass('animate__fadeInUp');
    $('.hover-box').eq($(this).index()).removeClass('animate__fadeOutDown');
  }, function () {
    $(this).removeClass('nav-hover');
    $('.hover-box').eq($($(this).index())).removeClass('nanimate__fadeInUp');
    $('.hover-box').eq($(this).index()).removeClass('active');
    $('.hover-box').eq($(this).index()).addClass('animate__fadeOutDown');
  });
}

function getTabList() {
  gets('../assets/tab.json', checkTab);
} // get请求


function gets(url, fn) {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    success: fn
  });
}

var tabArr = []; //tab切换 每个详情内容模板.（为模版字符串）

var conList = []; //存放内容模板的数组.（每一个元素为数组的每一项）

var coordinate = []; //记录所有元素初始的坐标值（left，top）

/* TODO:生成tab所需模板 */

function checkTab(res) {
  var tabList = res.tabList;
  var tab = ''; //tab 点击的每一项

  var tabConBox = ''; //tab 每一项详细内容的盒子

  tabList.forEach(function (item, index) {
    if (index == 0) {
      tab += "<li class='tab-list-active'>".concat(item.name, "</li>");
      tabConBox += "<li class=\"clearfix tab-container-active\"></li>";
    } else {
      tab += "<li>".concat(item.name, "</li>");
      tabConBox += "<li class=\"clearfix\"></li>";
    }

    var tabCon = ''; //单个详情内容,最后添加到数组tabArr中组成所有详情内容的数组.

    var obj = {
      id: index,
      arr: []
    };

    if (item.content && item.content.length > 0) {
      item.content.forEach(function (con, index) {
        tabCon += "<div style=\"background-image: url(./".concat(con.imgUrl, ");display: inline-block;\">").concat(con.id, "</div>");
        var oneStr = "<div style=\"background-image: url(./".concat(con.imgUrl, ");display: inline-block;\">").concat(con.id, "</div>");
        obj.arr.push(oneStr);
      });
    }

    tabArr.push(tabCon);
    conList.push(obj); //将所有的内容模板存入数组,为解决动画.
  });
  console.log('conlist', conList);
  $('.tab-list > ul').append(tab);
  $('.tab-container > ul li').append(tabArr[0]);
  $('.tab-container > ul li').children().each(function (child, el) {
    var _this = this;

    // console.log('child', child, el.offset().top)
    console.log('5555', $(this));
    var x = $('.tab-container > ul li').children().eq(child).position().left;
    var y = $('.tab-container > ul li').children().eq(child).position().top;
    var o = {
      x: x,
      y: y
    };
    coordinate.push(o);
    setTimeout(function () {
      $(_this).css({
        position: 'absolute',
        left: "".concat(x, "px"),
        top: "".concat(y, "px")
      });
    });
  });
  console.log('coordinate', coordinate);
  clickTab(tabArr); //点击切换tab
}

function clickTab() {
  var currentIndex = currentIndex ? currentIndex : 0;
  $('.tab-list > ul li').click(function () {
    // console.log('111', currentIndex)
    var preIndex = currentIndex;

    if (currentIndex == $(this).index()) {
      // console.log('111', currentIndex)
      return;
    } else {
      currentIndex = $(this).index(); // console.log('222', currentIndex)

      var currentList = conList[currentIndex].arr;
      var indexArr = [];
      var allIndex = [];
      var allPreIndex = allPreIndex ? allPreIndex : [];
      var allList = conList[0].arr;
      currentList.forEach(function (current, cindex) {
        allList.forEach(function (pre, preIndex) {
          if (allIndex.indexOf(preIndex) == -1) {
            allIndex.push(preIndex);
          }

          if (current == pre) {
            indexArr.push(preIndex); // console.log('indexArr', indexArr)
          } else {
            console.log('没有');
          }
        });
      });
      allPreIndex = indexArr;
    }

    $(this).addClass('tab-list-active').siblings().removeClass('tab-list-active');
    $('.tab-container > ul li').eq($(this).index()).addClass('tab-container-active').siblings().removeClass('tab-container-active');
    var nosame = []; //indexArr 为每一项应该出现的元素的坐标值，nosame为不该出现的坐标值。

    for (var i = 0; i < allIndex.length; i++) {
      var count = 0;

      for (var j = 0; j < indexArr.length; j++) {
        if (allIndex[i] == indexArr[j]) {
          count++;
        }
      }

      if (count == 0) {
        nosame.push(allIndex[i]);
      }
    }

    var elArr = []; //把出现的元素，提取出一个新的数组，为了对应初始的坐标值。

    indexArr.forEach(function (haveIndex) {
      elArr.push(haveIndex);
      var ifshow = $('.tab-container > ul li').children().eq(haveIndex).css('display');

      if (ifshow !== 'inline-block') {
        $('.tab-container > ul li').children().eq(haveIndex).removeClass('moveOut');
        $('.tab-container > ul li').children().eq(haveIndex).css('display', 'inline-block');
        $('.tab-container > ul li').children().eq(haveIndex).addClass('moveIn');
      }

      $('.tab-container > ul li').children().eq(haveIndex);

      for (var _i = 0; _i < elArr.length; _i++) {
        //将从新排序的元素，赋予初始的该位置的坐标值，加上延迟，来达到移动动画效果。
        $('.tab-container > ul li').children().eq(elArr[_i]).css({
          transtion: '.5s',
          left: "".concat(coordinate[_i].x, "px"),
          top: "".concat(coordinate[_i].y, "px")
        });
      }
    });

    if (nosame.length > 0) {
      nosame.forEach(function (haveIndex) {
        $('.tab-container > ul li').children().eq(haveIndex).removeClass('moveIn');
        $('.tab-container > ul li').children().eq(haveIndex).addClass('moveOut');
        setTimeout(function () {
          $('.tab-container > ul li').children().eq(haveIndex).css('display', 'none');
        }, 500);
      });
    }
  });
}

window.onload = function () {
  getNavList(); //获取菜单栏列表

  getTabList(); //获取tab列表
};