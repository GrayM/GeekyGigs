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


///////////////////////// MAKES DIVS REORGANIZE ON SCROLL ////////////////////////

$(document).ready(function() {
    var s = $("#searchForm");
    var t = $("#tag");
    var g = $(".grid-header");

    var isSticking = false;

    $(window).scroll(function() {
        var windowpos = $(window).scrollTop();
        var pos = s.position();
        var shouldSetSticky = windowpos >= pos.top + 23;

        if (shouldSetSticky && !isSticking) {
            s.addClass("stick");
            t.addClass("tag");
            g.addClass("head1");
            isSticking = true;
        } else if(!shouldSetSticky && isSticking){
            s.removeClass("stick");
            t.removeClass("tag");
            g.removeClass("head1");
            isSticking = false;
        }

    });
});

////////////////////// VIEW ////////////////////////

var JobsView = Backbone.View.extend({

    scrollStop: function() {
        var s = $("form");
        var pos = s.position();
        $(window).scroll(function() {
            var windowpos = $(window).scrollT
            if (windowpos >= pos.top) {
                s.addClass("form");
            } else {
                s.removeClass("form");
            }
        });
    },

    el: document.querySelector(".searchContainer"),

    initialize: function() {
        this.render();
        // this.scrollStop(); // not touching this yet, but should handle "fixing" the search to the top of the page
    },

    events: {
        "submit form": "handleSearch"
    },

    handleSearch: function(e) {
        e.preventDefault(); //prevent from refreshing
        var search = this.el.querySelector('[name="search"]');
        var location = this.el.querySelector('[name="location"]');
        this.render(search.value.trim(), location.value.trim());
    },

    getTemplateFill: function() {
        return $.get('/templates/jobTemplate.html').then(function(template) {
            return _.template(template);
        })
    },


    urlEmail: function() {
        return data.listings.listing[0].apply_url ? data.listings.listing[0].apply_url.length : data.listings.listing[0].apply_email;
    },


    render: function(searchValue, locationValue) {
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
        ];
        var fullURL = url.join("");

        var ajCollection = new AuthenticJobsCollection({
            location: locationValue,
            keywords: searchValue,
            perpage: 100,
            page: 1,
            // sort: ""
        });

        $.when(
            ajCollection.fetch(),
            this.getTemplateFill()
        ).then(function(data, templateFn) {
            var HTML = "";
            _.forEach(data[0].listings.listing, function(oneListing) {
                console.log(oneListing);

                if (!oneListing.company) {
                    oneListing.company = {
                        url: oneListing.url,
                        name: "",
                    }
                }

                if (!oneListing.company.location) {
                    oneListing.company.location = {};
                }
                if (!oneListing.company.location) {
                    oneListing.company.location.city = "";
                }

                if (oneListing.apply_url) {
                    oneListing.apply_link = oneListing.apply_url;
                } else if (oneListing.apply_email) {
                    oneListing.apply_link = "mailto:" + oneListing.apply_email;
                } else {
                    oneListing.apply_link = "#";
                }

                oneListing.post_date = moment(oneListing.post_date, "YYYY-MM-DD hh:mm:ss").format('LL')

                HTML += templateFn(oneListing);
            })
            $('.templateDestination').html(HTML);
        });
    }
});



////////////////// COLLECTION /////////////////////////

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

//////////////////////// MODEL ///////////////////////////

var JobModel = Backbone.Model.extend({
    defaults: {
        title: 'Job Title',
        company: 'Company',
        location: 'Location'
    }
});

/////////////////////// EXECUTION ////////////////////////

window.onload = app;

function app() {
    var jobsview = new JobsView();
}