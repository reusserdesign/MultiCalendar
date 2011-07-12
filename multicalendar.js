/*
multiCalendar jQuery plugin
If you want a description or something ask me.  I'm not writing it in here.

This implementation is released under the MIT license, bla bla bla
If you wish to ask questions, feel free
If you wish to criticise, go away.  Who asked you to criticise my work?
Who do you think you are just walking in and criticising everything, Mr. Critical or something?

Have a little respect folks, keep the Copyright notice intact, don't plagiarise.

Copyright (c) 2011 Eric Kever, ekever@reusserdesign.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function($){	
	methods = {
		rewrite : function(arg){
			var opts = arg || {},
				data = this.data('multiCalendar') || {},
				defaults = {
					days : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],  //The labels for each of the days on the calendar
					months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],  //The labels for each of the months on the calendar
					day_length : 2,  //How many letters of each day's label that will be shown on the calendar
					month_length : 3,  //How many letters of each month's label that will be shown on the calendar
					multiselect : true,  //Whether the user can select multiple dates
					minimize : false,  //Whether to minimize the amount of rows displayed on the calendar.  (If not, 6 rows will always be shown)
					nextMonth : 'internal',  //CSS selector, 'internal', or 'none'.  A CSS selector will point to an object to be used as the nextMonth action on click, internal will create arrows around the month and date, none will select none.
					prevMonth : 'internal',  //Same as nextMonth
					nextYear : 'none',  //CSS selector or 'none'.  A CSS selector will point to an object to be used as the nextYear action on click, none will select none.
					prevYear : 'none',  //Same as prevYear
					selectedList : 'none', //CSS selector or 'none'.  A CSS selector will point to an object that will list all of the selected dates, none will select none.
					listInput : 'none',  //CSS selector or 'none'.  A CSS selector will point to an input that will hold the dates in its value
					listDelimiter : '<br />',  //Delimiter for the list of all the selected dates.
					inputDelimiter : '|'  //Delimiter for the dates that will be put into the input.
					//You can also pass indices as an array or an object.  As an array, all date values given will be considered selected in the indices object.  As an object, all date keys given will be considered selected if that key's value is true (not evaulates to true, but actually is true).
				},
				days = opts.days || data.days || defaults.days,  //No need to use jQuery.extend, as the data is coming in in a way that if 0 pops up, we can't use it, and extend may give unexpected behaviour (I haven't extensively looked into its functionality)
				day_length = opts.day_length || data.day_length ||  defaults.day_length,
				months = opts.months || data.months || defaults.months,
				month_length = opts.month_length || data.month_length || defaults.month_length,
				date = new Date(),
				month = (opts.month > 0 && opts.month < 13 ? opts.month : false) || data.month || (date.getMonth() + 1),
				year = opts.year || data.year || date.getFullYear(),
				isthismonth = (month === (date.getMonth() + 1) && year === date.getFullYear()),
				today = date.getDate(),
				useless = new Date(year, (month - 1), 1),
				startday = useless.getDay(),
				tdstr = '',
				multiselect = (typeof opts.multiselect === typeof true ? opts.multiselect : (typeof data.multiselect === typeof true ? data.multiselect : defaults.multiselect)),
				minimize = (typeof opts.minimize === typeof true ? opts.minimize : (typeof data.minimize === typeof true ? data.minimize : defaults.minimize)),
				nextMonth = opts.nextMonth || data.nextMonth || defaults.nextMonth,
				prevMonth = opts.prevMonth || data.prevMonth || defaults.prevMonth,
				nextYear = opts.nextYear || data.nextYear || defaults.nextYear,
				prevYear = opts.prevYear || data.prevYear || defaults.prevYear,
				selectedList = opts.selectedList || data.selectedList || defaults.selectedList,
				listInput = opts.listInput || data.listInput || defaults.listInput,
				listDelimiter = opts.listDelimiter || data.listDelimiter || defaults.listDelimiter,
				inputDelimiter = opts.inputDelimiter || data.inputDelimiter || defaults.inputDelimiter,
				indices = data.indices || {},
				lengths = [31, (year % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
				thislen = lengths[month - 1],
				len = 0,
				lstart = 0,
				inputstr = '',
				outputstr = '',
				thehtml = '',  //My variables are better than yours
				i = 0,  //Common accumulator and also when the table starts being drawn out, number of cells that have been drawn
				j = 1,  //Day number it's on, and something else, I forget
				k = 0,  //Row number it's on, and something else, I forget
				ii = 0,
				ij = 0,
				index = '',
				tmp = '',
				$this = this;
			
			if(opts.indices && typeof opts.indices === typeof {}){
				if(opts.indices[0]) for(ii = 0, ij = opts.indices.length; ii < ij; ii++) indices[opts.indices[ii]] = true;
				else for(index in opts.indices) if(opts.indices[index] === true) indices[index] = true;
			}
			
			if(!multiselect){
				for(index in indices) if(indices[index] === true) tmp = index;
				indices = {};
				indices[tmp] = true;
			}
			
			if(days.length !== 7 && typeof days !== typeof []) return $.error('Error: days: Invalid argument, expecting a 7 element array.');
			if(months.length !== 12 && typeof months !== typeof []) return $.error('Error: months: Invalid argument, expecting a 12 element array.');
			
			this.data('multiCalendar', {
				days : days,
				day_length : day_length,
				months : months,
				month_length : month_length,
				month : month,
				year : year,
				multiselect : multiselect,
				minimize : minimize,
				nextMonth : nextMonth,
				prevMonth : prevMonth,
				nextYear : nextYear,
				prevYear : prevYear,
				selectedList : selectedList,
				listInput : listInput,
				listDelimiter : listDelimiter,
				inputDelimiter : inputDelimiter,
				indices : indices
			});
			
			for(; i < 7; i++) tdstr += '<td>' + days[i].substr(0, day_length) + '</td>';
			
			thehtml = '<table cellspacing="0"><thead><tr><th>' + (prevMonth === 'internal' ? '<a class="prevMonth">&laquo;</a>' : '') + '</th><th colspan="5">' + months[(month - 1)].substr(0, month_length) + ' ' + (year < 0 ? Math.abs(year) + ' BC' : year) + '</th><th>' + (nextMonth === 'internal' ? '<a class="nextMonth">&raquo;</a>' : '') + '</th></tr><tr>' + tdstr + '</tr></thead>';  //Yeah, a BC easter egg.  Why not?  A little consistency never hurt anyone.
			
			tdstr = '';
			if(startday > 0){
				len = (month === 1 ? 31 : lengths[month - 2]);
				for(i = startday, j = len; i > 0; i--, j--) tdstr = '<td class="mc-dead-date">' + j + '</td>' + tdstr;
				tdstr = '<tr>' + tdstr;
				for(j = 1, i = startday; i < 7; i++, j++) tdstr += '<td class="' + (j === today && isthismonth ? 'mc-today' : 'mc-live-date') + (indices[this.multiCalendar('dateToString', year, month, j)] || false ? ' mc-selected' : '') + ' mc-date">' + j + '</td>';
				lstart = 7;
				k++;
			}
			for(i = lstart; j <= thislen; i++, j++){
				if(i % 7 === 0){
					tdstr += (k > 0 ? '</tr>' : '') + '<tr>';
					k++;
				}
				tdstr += '<td class="' + (j === today && isthismonth ? 'mc-today' : 'mc-live-date') + (indices[this.multiCalendar('dateToString', year, month, j)] || false ? ' mc-selected' : '') + ' mc-date">' + j + '</td>';
			}
			if(minimize){
				if(i % 7 > 0){
					switch(k){
						//No need to test for 4, there is only 1 way that that the calendar will end up in 4 rows (See: Feb 2015) and at that point we won't need to add additional cells
						case 5:
							if(i < 35) for(k = 35 - i, j = 1; j <= k; j++) tdstr += '<td class="mc-dead-date">' + j + '</td>';
							break;
						case 6:
							if(i < 42) for(k = 42 - i, j = 1; j <= k; j++) tdstr += '<td class="mc-dead-date">' + j + '</td>';
					}
				}
			}else if(i < 42) for(j = 1; i < 42; i++, j++){
					if(i % 7 === 0) tdstr += '</tr><tr>';
					tdstr += '<td class="mc-dead-date">' + j + '</td>';
			}
			
			thehtml += '<tbody>' + tdstr + '</tr></tbody></table>';
			this.html(thehtml);
			
			this.find('>table>tbody>tr>td:last-child').addClass('mc-top');
			this.find('>table>tbody>tr>td:not(:last-child)').addClass('mc-common');
			this.find('>table>thead>tr>td:not(:last-child)').addClass('mc-date-label');
			this.find('>table>tbody>tr:last-child>td:last-child').addClass('mc-br-border-fix');
			this.find('>table>tbody>tr:last-child>td:first-child').addClass('mc-bl-border-fix');
			this.find('>table>thead>tr>th').addClass('mc-top-border-fix');
			
			//Bind all of our little clickadees.
			this.find('>table>tbody>tr>td.mc-date').click(function(){
				$this.multiCalendar('toggle', $this.multiCalendar('dateToString', year, month, $(this).html()));
			});
			switch(nextMonth){
				case 'internal':
					this.find('>table>thead>tr>th>a.nextMonth').unbind('click').click(function(){
						$this.multiCalendar('nextMonth')
					});
					break;
				case 'none':
					break;
				default:
					$(nextMonth).unbind('click').click(function(){
						$this.multiCalendar('nextMonth');
					});
			}
			switch(prevMonth){
				case 'internal':
					this.find('>table>thead>tr>th>a.prevMonth').unbind('click').click(function(){
						$this.multiCalendar('prevMonth');
					});
					break;
				case 'none':
					break;
				default:
					$(prevMonth).unbind('click').click(function(){
						$this.multiCalendar('prevMonth');
					});
			}
			switch(nextYear){
				case 'none':
					break;
				default:
					$(nextYear).unbind('click').click(function(){
						$this.multiCalendar('nextYear');
					});
			}
			switch(prevYear){
				case 'none':
					break;
				default:
					$(prevYear).unbind('click').click(function(){
						$this.multiCalendar('prevYear');
					});
			}
			
			switch(listInput){
				case 'none':
					break;
				default:
					i = 0;
					for(var index in indices) if(indices[index] === true) inputstr += (inputstr === '' ? '' : inputDelimiter) + index;
					$(listInput).val(inputstr);
			}
			switch(selectedList){
				case 'none':
					break;
				default:
					i = 0;
					for(var index in indices) if(indices[index] === true) outputstr += (outputstr === '' ? '' : listDelimiter) + index;
					$(selectedList).html(outputstr);
			}
			
			return this.addClass('multi-calendar');
		},
		
		nextMonth : function(){
			var data = this.data('multiCalendar');
			if(!data) return $.error('No multiCalendar instance detected on this object, please create one before calling nextMonth');
			data.month = (data.month < 12 ? (data.month + 1) : 1);
			data.year = (data.month === 1 ? (data.year + 1) : data.year);
			return methods['rewrite'].apply(this);
		},
		
		prevMonth : function(){
			var data = this.data('multiCalendar');
			if(!data) return $.error('No multiCalendar instance detected on this object, please create one before calling prevMonth');
			data.month = (data.month > 1 ? (data.month - 1) : 12);
			data.year = (data.month === 12 ? (data.year - 1) : data.year);
			return methods['rewrite'].apply(this);
		},
		
		nextYear : function(){
			var data = this.data('multiCalendar');
			if(!data) return $.error('No multiCalendar instance detected on this object, please create one before calling nextYear');
			data.year++;
			return methods['rewrite'].apply(this);
		},
		
		prevYear : function(){
			var data = this.data('multiCalendar');
			if(!data) return $.error('No multiCalendar instance detected on this object, please create one before calling prevYear');
			data.year--;
			return methods['rewrite'].apply(this);
		},
		
		toggle : function(id){
			var data = this.data('multiCalendar');
				indices = data.indices;
			if(!data) return $.error('No multiCalendar instance detected on this object, please create one before calling toggle');
			indices[id] = (indices[id] ? false : true);
			$.extend(data.indices, indices);
			return methods['rewrite'].apply(this);
		},
		
		dateToString : function(year, month, day){
			day = String(day);
			month = String(month);
			year = String(year);
			if(day.length === 1) day = '0' + day;
			if(month.length === 1) month = '0' + month;
			return (month + '/' + day + '/' + year);
		}
	};
	
	$.fn.multiCalendar = function(mth){
		var vers = $().jquery.split('.'),
			version = parseInt([vers[0], vers[1] || 0, vers[2] || 0].join(''));
		if(version < 143) return $.error('jQuery 1.4.3 or greater is required to use multiCalendar.');  //#todo needs to be compatible with earlier versions.
		if(methods[mth]) return methods[mth].apply(this, Array.prototype.slice.call(arguments, 1));
		else if(typeof mth === typeof {} || !mth) return methods.rewrite.apply(this, arguments);
		else $.error(mth + ' is not a valid multiCalendar method.');
	}
})(jQuery);