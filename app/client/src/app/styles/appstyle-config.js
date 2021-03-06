
// All postcss variables, and functions can go here
// UI inspiration from https://dribbble.com/shots/2119206-Hixle-Feed/attachments/384630
var colors = {
  blue0: '#333A4D',  // NavLeft bg
  blue1: '#3E445C',  // NavLeft bg expanded
  blue2: '#02AADB',  // NavLeft active, left border
  blue3a: '#484f6b',  // NavLeft row border-top
  blue3b: '#2E3246',  // NavLeft row border-bottom
  blue4: '#BCD9F5',  // NavLeft icon color over dark


  gray2: '#EEF3F6',  // content-prewrapper
  gray3: '#95AABC',  // Text on white, gray
  gray4: '#F5F9FC',  // NavSecondary, Right Sidebar 
  gray5: '#EEF3F6',  // Content main tbackground

  white0: '#fff',
  white1: '#DEE1E3',  // NavLeft text color over dark
  white2: '#E8E8EA',  // NavLeft header color
  white3: '#E1F4F8'  // NavLeft text color over active
};

var fonts = {
  fontFam1: "'Open Sans', sans-serif"
}


var variables = Object.assign({}, colors, fonts);


module.exports = variables;

