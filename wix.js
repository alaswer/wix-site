var dataItems;
var totalCount;
var currentPage;
var totalPages;
var skipped = 0;

var capValue = 0.0;

var slideInOptions, slideOutOptions, searchValue, currentSV, sortValue;
var allowedText = /^[a-zA-Z0-9\u0621-\u064A ]{3,}$/;

$w.onReady(function () {
	//TODO: write your page related code here..

	//local.setItem("page path", wixLocation.path);

	if (wixWindow.rendering.env === "browser") {

		local.setItem("loaded", true);

		$w("#whatsappContact").link = "https://api.whatsapp.com/send?phone=60178821833&text=السلام%20عليكم%0A%20اسمي:%20%0A%20أود%20طلب%20مشروع%20خاص%20بعنوان:%20";

		if (local.getItem("sortOption")) {
			$w("#sortOptions").selectedIndex = parseInt(local.getItem("sortOption"), 10);
			sortValue = $w("#sortOptions").selectedIndex;
		} else {
			sortValue = $w("#sortOptions").selectedIndex;
		}

		performQuery("serv", sortValue, 1);

	} else {
		//wixWindow.openLightbox("Plz Wait");
		$w("#plzWaitMsg").text = "يرجى الانتظار...";
		$w("#searchLoader").expand();
	}

	$w("#sortOptions").onChange((event, $w) => {
		sort_or_pagination(event);
		console.log("it works!");
	});

	$w("#pagination1").onChange((event, $w) => {
		sort_or_pagination(event);
		console.log("it works!");
	});

	$w("#pagination2").onChange((event, $w) => {
		sort_or_pagination(event);
		console.log("it works!");
	});

});

function sort_or_pagination(event) {

	let $item = $w.at(event.context);
	let nextPage = 0;

	if (event.target.id === "sortOptions") {
		sortValue = $item("#sortOptions").selectedIndex;
		local.setItem("sortOption", sortValue);
		setLoadingMsg(1);
		nextPage = 1;
	} else {
		nextPage = event.target.currentPage;
		setLoadingMsg(2);
	}


	$item("#projectsContent").collapse()
		.then(() => {
			$item("#headerAnchor").scrollTo().then(() => {
				if (!$item("#nonStickyHeader").hidden) {
					$item("#searchLoader").expand()
						.then(() => {
							performQuery("serv", sortValue, nextPage)
						});
				}
			});
		});

}

function performQuery(queryText, sortOption, page) {

	currentPage = page;
	
	skipped = (page - 1) * 32;

	switch (sortOption) {
	case 1:
		wixData.query('projects')
			.contains('proj_type', queryText)
			.limit(32)
			.skip(skipped)
			.descending("viewed")
			.find()
			.then((res) => {

				dataItems = res.items;
				totalCount = res.totalCount;
				totalPages = res.totalPages;
				$w('#dataRepeater').data = dataItems;

			}).catch((err) => {
				console.log(err);

			}).then(() => { populateRepeater() });
		break;
	case 2:
		wixData.query('projects')
			.contains('proj_type', queryText)
			.limit(32)
			.skip(skipped)
			.ascending("proj_cap")
			.find()
			.then((res) => {

				dataItems = res.items;
				totalCount = res.totalCount;
				totalPages = res.totalPages;
				$w('#dataRepeater').data = dataItems;

			}).catch((err) => {
				console.log(err);

			}).then(() => { populateRepeater() });
		break;
	case 3:
		wixData.query('projects')
			.contains('proj_type', queryText)
			.limit(32)
			.skip(skipped)
			.descending("proj_cap")
			.find()
			.then((res) => {

				dataItems = res.items;
				totalCount = res.totalCount;
				totalPages = res.totalPages;
				$w('#dataRepeater').data = dataItems;

			}).catch((err) => {
				console.log(err);

			}).then(() => { populateRepeater() });
		break;
	default:
		wixData.query('projects')
			.contains('proj_type', queryText)
			.limit(32)
			.skip(skipped)
			.ascending("temp_id")
			.find()
			.then((res) => {

				dataItems = res.items;
				totalCount = res.totalCount;
				totalPages = res.totalPages;
				$w('#dataRepeater').data = dataItems;

			}).catch((err) => {
				console.log(err);

			}).then(() => { populateRepeater() });
		break;
	}
}

function populateRepeater() {

	$w("#dataRepeater").onItemReady(($w, itemData, index) => {
		$w("#projLink").src = itemData.img1;
		$w("#projLink").tooltip = itemData.title;
		$w("#projLink").link = "https://www.jdwa4u.com/projects/" + itemData.title;
		$w("#projLink").target = "_blank";

		capValue = itemData.proj_cap;

		if (capValue < 1) {
			capValue = capValue * 1000;
			$w("#capValue").text = "رأس المال: " + capValue + " ألف ر.س.";
		} else {
			$w("#capValue").text = "رأس المال: " + capValue + " مليون ر.س.";
		}

		$w("#projTitle").text = itemData.title;

		if (itemData.viewed === undefined || itemData.viewed < 1) {
			$w("#viewsCounter").text = "0 مشاهدة";
		} else {
			$w("#viewsCounter").text = itemData.viewed + "  مشاهدة";
		}
	});

	//if (wixWindow.rendering.env === "browser") {

	$w("#searchLoader").collapse()
		.then(() => {
			$w("#pagination1").currentPage = currentPage;
			$w("#pagination2").currentPage = currentPage;
			$w("#pagination1").totalPages = totalPages;
			$w("#pagination2").totalPages = totalPages;
		})
		.then(() => {
			if ($w("#projectsHeader").collapsed) {
				$w("#totalProjects").text += " " + totalCount + ")";
				$w("#projectsHeader").expand();
			}
		}).then(() => {
			$w("#projectsContent").expand();
		});
	//}
}

function setLoadingMsg(condition) {
	if (wixWindow.rendering.env === "browser") {

		switch (condition) {
		case 1:
			$w("#plzWaitMsg").text = "يرجى الانتظار.. يتم إعادة فرز المشاريع";
			break;

		case 2:
			$w("#plzWaitMsg").text = "يرجى الانتظار.. يتم عرض المزيد من المشاريع";
			break;
		}
	}
}