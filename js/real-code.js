// var DiceJobsCollection = Backbone.Collection.extend({
//     initialize: function(options) {
//         this.location = options.location;
//         this.description = options.description;
//     },
//     url: function() {
//         return "/jobsearch/" + this.description + "/" + this.location;
//     },
//     parse: function(data) {
//         console.log(data);
//         this.count = data.count;
//         this.firstDocument = data.firstDocument;
//         this.lastDocument = data.lastDocument;
//         this.nextUrl = data.nextUrl;
//         return data.resultItemList;
//     }
// })

var JobsView = Backbone.View.extend({

	el: document.querySelector(".searchContainer"),

    initialize: function() {
    	console.log(this.el)
        this.render();
    },

    events: {
    	"submit form": "handleSearch"
    },

    handleSearch: function(e){
    	e.preventDefault(); //prevent from refreshing
    	var inputs = this.el.querySelectorAll("input");
    	var result = this.convertSearchTermsToKeywordArray(inputs[0].value);
    	console.log(result)
    	this.render(result);
    },

    getTemplateFill: function() {
        return $.get('/templates/jobTemplate.html').then(function(template) {
            return _.template(template);
        })
    },

    searchForKeywords: function(keyword_array, textDescription){
    	// keyword_array e.g. ['js', 'javascript', 'html5']
    	var keywordsInDescription = _.map(keyword_array, function(keyword){
    		var regex = new RegExp(keyword, 'ig');
    		var result = textDescription.match(regex);
    		return result ? result.length : 0;
    	})
    	return keywordsInDescription;
    },

    urlEmail: function() {
    	return data.listings.listing[0].apply_url ? data.listings.listing[0].apply_url.length : data.listings.listing[0].apply_email;
    },

    convertSearchTermsToKeywordArray: function(oneBigGiantSearchString){
    	var result = oneBigGiantSearchString.split(',').map(function(s){
		    return s.trim();
		});

		return result;
    },


    render: function(keywordArray) {
    	// example that turns a string of comma seperated keywords into an array of keywords
    	///

    	var self = this;
        var url = [
            "/authenticjobs",
            "?api_key=",
            "7770219dad2350459bd66d5c3bf70485",
            "&method=",
            "aj.jobs.search",
            "&format=",
            "json"
        ]
        var fullURL = url.join("");

        var testCollection = new AuthenticJobsCollection({
            location: "tx",
            keywords: "javascript",
            perpage: 100,
            page: 1,
            // sort: ""
        });

        $.when(testCollection.fetch(),
            this.getTemplateFill()
        ).then(function(data, templateFn) {
            var HTML = "";
            _.forEach(data[0].listings.listing, function(oneListing) {
            	var occurrences = self.searchForKeywords(keywordArray, oneListing.description)
            	console.log(occurrences);
            	// oneListing.keyWordOccurences = occurrences;
            	HTML += templateFn(oneListing);
            })
            $('.results').html(HTML);
        });
    }
});

var AuthenticJobsCollection = Backbone.Collection.extend({
    initialize: function(options) {
        this.location = options.location;
        this.keywords = options.keywords;
        this.perpage = options.perpage;
        this.page = options.page;
        this.sort = options.sort;
    },
    url: function() {
        var url = [
            "/authenticjobs",
            "?api_key=",
            "7770219dad2350459bd66d5c3bf70485",
            "&method=",
            "aj.jobs.search",
            "&format=",
            "json"
        ]

        if (this.keywords) {
            url.push("&keywords=", this.keywords);
        }
        if (this.location) {
            url.push("&location=", this.location);
        }
        if (this.perpage) {
            url.push("&perpage=", this.perpage);
        }
        if (this.page) {
            url.push("&page=", this.page);
        }
        if (this.sort) {
            url.push("&sort=", this.sort);
        }

        return url.join("")
    },
    parse: function(data) {
        console.log(data);
        return data.listings.listing[0];
    }
})

var JobModel = Backbone.Model.extend({
    defaults: {
        title: 'Job Title',
        company: 'Company',
        location: 'Location'
    }
});

window.onload = app;

function app() {
    var jobsview = new JobsView();
}