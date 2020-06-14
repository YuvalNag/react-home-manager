const getUrl = window.location
const baseUrl = getUrl.protocol + "//api." + getUrl.host

const state = {
    selectedBranchChanged: false,
    lastCode: "",
    branches: {},
    location: {
        fetched: false,
        enabled: false,
        address: "",
        coordinates: "",
        maxDistance: 10,
    },
    loading: {
        branch: true,
        quagga: true,
    },
}


$(async function () {

    initBranchSelect()
    toggleLoading()
    updateBranches()
    attachListeners()
    initCityAddressForm()
    initTables()
});



//scanner
function initScanner() {
    state.loading.quagga = true
    toggleLoading()
    quagga((err) => {
        state.loading.quagga = false
        toggleLoading()
    }, detectionCb)
}

function stopScanner() {
    Quagga.stop()
}

function detectionCb(result) {
    let code = result.codeResult.code;

    console.log(code)

    if (state.lastCode !== code && !state.loading.item) {

        state.loading.item = true
        toggleLoading()
        state.lastCode = code;

        window.navigator.vibrate(0)
        window.navigator.vibrate(200)



        let canvas = Quagga.canvas.dom.image;

        $('#itemScanner').hide()

        const imageUrl = canvas.toDataURL()


        getItem(code, (error, result) => {
            if (error) {
                return
            }
            if (result.item) {
                noItemAlert()
                showItemTable(result.item, imageUrl, code, 'Scanner')
            } else {
                noItemAlert(code)
            }
            state.loading.item = false
            toggleLoading()
        })

    }
}

//item html
function showItem(item, imageUrl, code, id = 'item') {


    const $item = $(`#${id}`)
    const $code = $item.find('#code')
    const $image = $item.find('#image')
    const $name = $item.find('#name')
    const $list = $item.find('#list')
    const $description = $item.find('#description')
    $list.empty();

    $code.text(code)

    $("error").off("error")

    $image.on("error", function () {
        $(this).attr('src', imageUrl);
        $(this).off("error")
    })

    $image.attr("src", `https://m.pricez.co.il/ProductPictures/s/${code}.jpg`);
    $name.text(item.ItemName)

    $description && $description.text(item.ManufacturerItemDescription)

    for (price of item.ItemBranches) {
        const $node = $(`<li class="list-group-item text-right">
        <span class="h5">${state.branches[price.BranchId].Chain.ChainName}</span>
        <small class="text-muted">${state.branches[price.BranchId].StoreName}</small>
        <span class="badge badge-success">${price.ItemPrice}</span>
      </li>`)
        promotions($node, price.Promotions, price.BranchId)
        $list.append($node)
    }
    $item.show();

}

function promotions($node, promotions, code) {

    let noCoupon = true
    const $couponNode = $(`<div class="card" dir="rtl">
    <div class="badge badge-danger card-header" data-toggle="collapse" href="#branch${code}" aria-expanded="true">
    <span class="float-right">קופון</span>
    </div>
      <div id="branch${code}" class="card-body collapse" style="">
        
      </div>
    </div>`)
    for (promo of promotions)
        switch (promo.RewardType) {

            case 1:
            case 10: {
                if (promo.MinQty === 1) {
                    $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br> מחיר מבצע ${promo.DiscountedPrice} </span>`))
                } else {
                    $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br> ${promo.MinQty} ב ${promo.DiscountedPrice} </span>`))
                }
                break
            }
            case 2: {
                $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br> ${promo.DiscountRate}% הנחה  </span>`))
                break
            }
            case 3: {
                noCoupon = false
                $couponNode.find(`#branch${code}`).append($(`<span class="badge badge-danger text-wrap" dir="rtl">${promo.PromotionDescription}<br> קוד קופון  ${promo.PromotionId}   </span>`))
                break
            }
            case 6: {
                $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br> קנה ${promo.MinQty} קבל מתנה  </span>`))
                break
            }
            case 7: {
                $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br>  ${promo.MinQty-1}  + 1 מתנה  </span>`))
                break
            }
            case 9: {
                if (promo.DiscountedPrice === null && promo.DiscountRate === null)
                    $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br>  ${promo.MinQty-1} קבל + 1 מתנה  </span>`))
                else if (promo.DiscountedPrice !== null)
                    $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br> המוצר ה- ${promo.MinQty} ב  ${promo.DiscountedPrice} </span>`))
                else
                    $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}<br> המוצר ה- ${promo.MinQty} ב  ${promo.DiscountedPrice}% הנחה </span>`))
                break
            }
            case 11: {
                break
            }
            default:
                $node.append($(`<span class="badge badge-warning text-wrap" dir="rtl">${promo.PromotionDescription}</span>`))

        }
    if (!noCoupon) {
        $node.append($couponNode)
    }

}

function noItemAlert(code) {
    const $node = $('#noItem')
    if (code) {
        $node.find('span').text(code)
        $node.show()
    } else {
        $node.hide()
    }
}

function selectTable(table) {
    //refresh table
    const api = table.api()
    api.columns().search('').draw();

    //show the distance field only when location is enabled
    api.columns([3]).visible(state.location.enabled)

    // show the select on the bottom
    api.columns([0]).every(function () {
        var column = this;
        // if (column[0][0] > 0)
        //     return
        var select = $('<select class="selectpicker" data-dropdown-align-right="true" data-size="10" data-action-box="true"  data-live-search="true"><option value=""></option></select>')
            .appendTo($(column.footer()).empty())
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                column
                    .search(val ? val : '', true, false)
                    .draw();
            });

        const arr = column.data().toArray()
        const res = {}
        for (item of arr) {
            if (!res[item[0]]) {

                res[item[0]] = new Set()
            }
            res[item[0]].add(item[1])
        }



        for (chain in res) {
            const $optgroup = $(`<optgroup label="${chain}"><option  value="${chain}"  >${chain}  </option></optgroup>`);
            for (branch of res[chain]) {
                const $node = $(`<option  value="${branch}"  >${branch}  </option>`);
                $optgroup.prepend($node);
            }
            select.append($optgroup);
        }
        select.selectpicker('refresh')


    });

    api.columns([2]).every(function () {
        var column = this;
        const arr = column.data().toArray()

        const hasPromo = arr.some(promo => promo[0].length != 0)

        column.visible(hasPromo)

    });
}

function initTables() {
    initTable('Search')
    initTable('Scanner')
}

function initTable(id) {
    $(`#itemTable${id}`).DataTable({
        // "scrollX": true,
        // searching: false,
        // paging: false,
        // "scrollX": true,

        "order": [
            [1, "asc"],
            [3, "asc"]
        ],
        "dom": '<"top">rt<"bottom"iflp><"clear">',
        "columnDefs": [{

                "render": function (data, type, row) {
                    return `<h5 >${data[0]}</h5> <span >${data[1]}</span>`;
                },
                "targets": 0
            },
            {

                "render": function (data, type, row) {
                    return `<span class="badge badge-success">${data}₪</span>`;
                },
                "targets": 1
            },
            {
                // orderable: false,
                "render": function (data, type, row) {
                    if (data[0].length == 0) {
                        return ''
                    }
                    const $node = $(`<li class="list-unstyled text-right" style="padding: 0px;"></li>`)
                    promotions($node, data[0], data[1])
                    return $node[0].outerHTML

                },
                "targets": 2
            },
            {

                "render": function (data, type, row) {

                    if (!data) {
                        return 'N/A'
                    } else return data.toFixed(2)

                },
                "targets": 3
            },

        ]
    });
}

function showItemTable(item, imageUrl, code, section = 'Search') {


    const $item = $(`#item${section}`)
    const $code = $item.find('#code')
    const $image = $item.find('#image')
    const $name = $item.find('#name')
    const $list = $item.find('#list')
    const $description = $item.find('#description')
    $list.empty();

    $code.text(code)

    $("error").off("error")

    $image.on("error", function () {
        $(this).attr('src', imageUrl);
        $(this).off("error")
    })

    $image.attr("src", `https://m.pricez.co.il/ProductPictures/s/${code}.jpg`);
    $name.text(item.ItemName)

    $description && $description.text(item.ManufacturerItemDescription)

    const table = $(`#itemTable${section}`).dataTable()

    table.fnClearTable()

    table.fnAddData(
        item.ItemBranches.map(price => {
            return [
                [state.branches[price.BranchId].Chain.ChainName,
                    state.branches[price.BranchId].StoreName
                ],
                price.ItemPrice,
                [price.Promotions, price.BranchId],
                state.branches[price.BranchId].distance

            ]
        })
    )
    selectTable(table)


    $item.show();

}

function initBranchSelect() {
    const selectPickerNode = $('#branchSearch')


    selectPickerNode.on('search.bs.select', function (e, length) {

        if (length > 60) {
            $('#nav-settings  div.bs-actionsbox  button.actions-btn.bs-select-all.btn.btn-light').prop('disabled', true)
        } else {
            $('#nav-settings  div.bs-actionsbox  button.actions-btn.bs-select-all.btn.btn-light').prop('disabled', false)
        }


    });

    selectPickerNode.on('change.bs.select', function (e, length) {

        state.selectedBranchChanged = true


    });

    selectPickerNode.on('shown.bs.select', function () {

        if ($('#branchSearch option').length > 60) {
            $('#nav-settings  div.bs-actionsbox  button.actions-btn.bs-select-all.btn.btn-light').prop('disabled', true)
        } else {
            $('#nav-settings  div.bs-actionsbox  button.actions-btn.bs-select-all.btn.btn-light').prop('disabled', false)
        }


    });


    selectPickerNode.selectpicker({
        maxOptions: 60,
        selectAllText: 'Select All MAX 40'
    });

}

//html elements handlers
function attachListeners() {
    search()
    tab()
    slider()
    settings()
}

function search() {
    $('#searchItem').selectize({
        onChange: function () {
            this.clear(true)
            // this.clearOptions()
        },
        dropdownParent: 'body',
        valueField: 'ItemCode',
        labelField: 'ItemName',
        searchConjunction: 'or',
        searchField: ['ItemName', 'ItemCode'],
        onItemAdd: function (value) {
            if (value === "")
                return
            state.loading.item = true
            toggleLoading()
            $('#itemSearch').hide()
            getItem(value, (error, result) => {
                if (result && result.item) {
                    $('#noItemSearch').hide()
                    showItemTable(result.item, "img/grocery-basket-4880912_640.png", value, 'Search')
                } else {
                    $('#noItemSearch').show()
                }
                state.loading.item = false
                toggleLoading()
            })
        },
        options: [],
        create: false,
        render: {
            item: function (item, escape) {
                // $('<img>').attr('src', `https://m.pricez.co.il/ProductPictures/s/${item.ItemCode}.jpg`).css("height", 18), ' ',
                // item.ItemName
                return `<div class="badge chosen">   
                <img class="_search_img" 
                        src="https://m.pricez.co.il/ProductPictures/s/${item.ItemCode}.jpg" 
                        onerror='this.src="img/grocery-basket-4880912_640.png"'  
                        alt="not found">
                <span class="align-self-center">
                      ${item.ItemName}
                    </span>
                 
                    
                  </div>`
            },
            option: function (item, escape) {

                //     // return `<div class="badge d-flex">
                //     //     <img class="_search_img" src="https://m.pricez.co.il/ProductPictures/s/${item.ItemCode}.jpg" onerror='this.src="img/grocery-basket-4880912_640.png"'  alt="not found">
                //     //     <span class="align-self-center">
                //     //       ${item.ItemName}
                //     //     </div>
                //     //   </div>`

                //     //     return `<div id="searchOption" class="media" dir="rtl">
                //     //     <img class="_search_img ml-3" src="https://m.pricez.co.il/ProductPictures/s/${item.ItemCode}.jpg" onerror='this.src="img/grocery-basket-4880912_640.png"'  alt="not found">
                //     //     <div class="media-body media-body align-self-center text-justify" dir="rtl">
                //     //       <span id="name" class="mt-2 font-weight-bold" dir="rtl"> ${item.ItemName}</span>
                //     //       <br>
                //     //       <font id="description" class="text-muted">${item.ManufacturerItemDescription}</font>
                //     //     </div>
                //     //   </div>`


                //     `<div  class="media my-3" dir="rtl">
                //     <img class="_search_img mr-2 ml-3 align-self-center" src="https://m.pricez.co.il/ProductPictures/s/${item.ItemCode}.jpg" onerror='this.src="img/grocery-basket-4880912_640.png"'  alt="not found">
                //     <div class="media-body media-body align-self-center text-justify" dir="rtl">
                //     <span id="avg" class="badge badge-success"> Avg ${item.mean.toFixed(2)}₪</span>
                //       <h5 id="name" class="mt-0" dir="rtl"> ${item.ItemName}</h5>
                //       <span id="description" class="text-muted">${item.ManufacturerItemDescription}</span>
                //     </div>
                //   </div>`

                function wrapper(...childrens) {
                    return `<div class="media my-3" dir="rtl">
                    <img class="option_item_search_img mr-2 ml-3 align-self-center"
                        src="https://m.pricez.co.il/ProductPictures/s/${item.ItemCode}.jpg"
                        onerror='this.src="img/grocery-basket-4880912_640.png"' alt="not found">
                    <div class="media-body option_item_media-body align-self-center option_item_media-body" dir="rtl">
                        <h5 id="name" class="mt-0" dir="rtl">${item.ItemName}</h5>
                        <div class="d-flex ">
                            ${childrens.join('\n')}
                        </div>
                    </div>
                </div>`
                }

                function figure(price,elClass='',badge='warning') {
                    return `<div id="avg" class="badge badge-${badge} ${elClass}"> Price ${price.ItemPrice.toFixed(2)}₪
                            <div class="pt-2">
                                <figure class="figure m-auto">
                                    <img src="img/chain_id/${state.branches[price.BranchId].ChainId}.png"
                                        class=" option_item_img figure-img img-fluid rounded" alt="...">
                                    <figcaption class="option_item_store">${state.branches[price.BranchId].StoreName}</figcaption>
                                </figure>
            
                            </div>
                        </div>`
                }

                if (item.min && item.min.BranchId === item.max.BranchId) {
                    item.price = item.min
                }
                if (item.price) {
                    return wrapper(figure(item.price,'','success'))
                } else {
                    return wrapper(figure(item.min,'option_item_badge_edge','success'),
                                    `<div class="badge badge-info  align-self-stretch option_item_badge_middle"> Avg <br><br>${item.mean.toFixed(2)}₪</div>`,
                                    figure(item.max,'option_item_badge_edge','warning'))
                    
                    
                    
                    // `<div class="media my-3" dir="rtl">
                    //             <img class="option_item_search_img mr-2 ml-3 align-self-center"
                    //                 src="https://m.pricez.co.il/ProductPictures/s/${item.ItemCode}.jpg"
                    //                 onerror='this.src="img/grocery-basket-4880912_640.png"' alt="not found">
                    //             <div class="media-body media-body align-self-center option_item_media-body" dir="rtl">
                    //                 <h5 id="name" class="mt-0" dir="rtl">${item.ItemName}</h5>
                    //                 <div class="d-flex ">
                    //                     <div class="badge badge-success align-self-stretch option_item_badge_edge"> Min<br>
                    //                         ${item.min.ItemPrice.toFixed(2)}₪
                    //                         <div class="pt-2">
                    //                             <figure class="figure m-auto">
                    //                                 <img src="img/chain_id/${state.branches[item.min.BranchId].ChainId}.png"
                    //                                     class=" option_item_img figure-img img-fluid rounded" alt="...">
                    //                                 <figcaption class="option_item_store">${state.branches[item.min.BranchId].StoreName}</figcaption>
                    //                             </figure>
                            
                    //                         </div>
                    //                     </div>
                            
                    //                     <div class="badge badge-info  align-self-stretch option_item_badge_middle"> Avg <br><br>${item.mean.toFixed(2)}₪</div>
                    //                     <div class="badge badge-warning align-self-stretch option_item_badge_edge"> Max
                    //                         <br>${item.max.ItemPrice.toFixed(2)}₪
                    //                         <div class="pt-2">
                    //                             <figure class="figure m-auto">
                    //                                 <img src="img/chain_id/${state.branches[item.max.BranchId].ChainId}.png"
                    //                                     class=" option_item_img figure-img img-fluid rounded" alt="...">
                    //                                 <figcaption class="option_item_store">${state.branches[item.max.BranchId].StoreName}</figcaption>
                    //                             </figure>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //         </div>`

                }


            }
        },
        load: function (query, callback) {
            if (query.length <= 1) return callback();
            // let's do a custom ajax call
            // if (state.ajax)
            //     state.ajax.abort()
            let branches = $('.branchSelect').selectpicker('val')
            state.ajax = $.ajax({
                url: `${baseUrl}/supermarket/item`,
                method: 'GET',
                mode: '',
                traditional: true,
                data: {
                    // price:true,
                    searchTerm: query,
                    branchIds: branches,
                    limit: 40
                },
                dataType: 'json'
            })

            state.ajax.done(function (res) {
                $('#searchItem')[0].selectize.clearOptions()
                callback(res.items)
            });

            state.ajax.fail((err) => {
                console.log(err);
                callback()

            })

            state.ajax.always(() => {
                state.ajax = null;
            });


        }
    });
}

function tab() {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if (e.target.text === 'Settings') {
            $('.branchSelect').selectpicker('refresh')
        } else {
            if (e.target.text === 'Scanner') {
                initScanner()
            }
            if (state.selectedBranchChanged) {

                const selectize = $('#searchItem')[0].selectize;
                selectize.clear()
                selectize.clearOptions()
                $('#itemSearch').hide()

                $('#itemScanner').hide()
                state.selectedBranchChanged = false
            }

        }

    })

    $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        if (e.target.text === 'Scanner') {
            state.lastCode = ''
            stopScanner()
        }

    })
    $('a[href="#nav-scanner"]').trigger('shown.bs.tab')

}

function slider() {
    const $slider = $('#slider');

    $slider.on('input', function () {
        const dist = $(this).val()
        $('#km').html(dist + 'km')
        state.location.maxDistance = Number(dist)
    })

    $slider.on('change', function () {
        showBranches()
    })
}

function settings() {
    $("#sort").change(async function () {
        if ($(this).is(':checked')) {
            $('#locationLabel').text('location Enabled! check to Disable')
            if (!state.location.fetched) {
                await updateLocation()
            } else {
                state.location.enabled = true
                showBranches()
            }

        } else {
            $('#locationLabel').text('location Disabled! check to Enable')
            state.location.enabled = false
            showBranches()
        }
    });

    $('#addressModelClose').click(function () {
        $("#sort").prop('checked', false)
        $('#range').collapse('hide')
    })
    $("#addressSave").click(async function () {

        const form = $('form[name="addressForm"')
        const res = serializeToJson(form)
        state.location.enabled = true
        state.location.address = res.street + ', ' + res.city
        $('#addressModel').modal('toggle')

        await updateBranches()
        state.location.fetched = true
    });
}

function toggleLoading() {
    $('#loading').modal(Object.values(state.loading).some(val => val) ? 'show' : 'hide')
}


//back end calls
function getItem(code, callback) {
    let branches = $('.branchSelect').selectpicker('val')
    branches = branches.map((id => `branchIds=${id}`))
    branches = branches.join('&')

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`${baseUrl}/supermarket/item/${Number(code)}?` + branches, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            callback(null, result)
        })
        .catch(error => {
            console.log('error', error)
            callback(error)
        })

}

async function updateBranches(location) {
    try {
        state.loading.branch = true
        toggleLoading()

        let url = baseUrl + '/supermarket/branch?'


        // for(key in query)
        //     url+=`${key}=${query[key]}&`
        if (state.location.enabled) {
            if (state.location.coordinates)
                url += `coordinates=${state.location.coordinates}`
            if (state.location.address)
                url += `address=${state.location.address}`
        }

        const res = await fetch(url)

        const branches = await res.json()


        state.branches = keyBy(branches.branches, 'id')


        showBranches();

        state.loading.branch = false
        toggleLoading()

    } catch (e) {
        console.error(e)
        state.loading.branch = false
        toggleLoading()
    }
}

function showBranches() {
    let branches = Object.values(state.branches)
    if (state.location.enabled) {
        branches = branches.filter(branch => branch.distance <= state.location.maxDistance)
    }
    const groupByChain = groupBy(branches, 'Chain.ChainName')
    const selectPickerNode = $('#branchSearch');
    selectPickerNode.find('option').remove();

    for (chain in groupByChain) {
        const $optgroup = $(`<optgroup label="${chain}"></optgroup>`);
        for (branch of groupByChain[chain]) {
            const $node = $(`<option  value=${branch.id} data-tokens="${chain}" >${branch.StoreName}  </option>`);
            $optgroup.prepend($node);
        }
        selectPickerNode.append($optgroup);
    }

    selectPickerNode.selectpicker('render');
    selectPickerNode.selectpicker('refresh');

    if (state.location.enabled) {
        selectPickerNode.selectpicker('selectAll')
    }
}

//location
function cityListUpdate() {
    const cityList = ["אבו גוש", "אבו סנאן", "אבו תלול", "אבטין", "אבטליון", "אביאל", "אביבים", "אביגדור", "אביחיל", "אביטל", "אביעזר", "אבירים", "אבן יהודה", "אבן מנחם", "אבן ספיר", "אבן שמואל", "אבני איתן", "אבני חפץ", "אבנת", "אבשלום", "אדורה", "אדירים", "אדמית", "אדרת", "אודים", "אודם", "אוהד", "אום אל-פחם", "אום אל-קוטוף", "אום בטין", "אומן", "אומץ", "אופקים", "אור הגנוז", "אור הנר", "אור יהודה", "אור עקיבא", "אורה", "אורות", "אורטל", "אורים", "אורנים", "אורנית", "אושה", "אזור", "אחווה", "אחוזם", "אחוזת ברק", "אחיהוד", "אחיטוב", "אחיסמך", "אחיעזר", "איבים", "אייל", "איילת השחר", "אילון", "אילות", "אילניה", "אילת", "אירוס", "איתמר", "איתן", "איתנים", "אכסאל", "אל סייד", "אל-עזי", "אל-עריאן", "אל-רום", "אלומה", "אלומות", "אלון הגליל", "אלון מורה", "אלון שבות", "אלוני אבא", "אלוני הבשן", "אלוני יצחק", "אלונים", "אלי-עד", "אליאב", "אליכין", "אליפז", "אליפלט", "אליקים", "אלישיב", "אלישמע", "אלמגור", "אלמוג", "אלעד", "אלעזר", "אלפי מנשה", "אלקוש", "אלקנה", "אמונים", "אמירים", "אמנון", "אמציה", "אניעם", "אספר", "אעבלין", "אפיק", "אפיקים", "אפק", "אפרת", "ארבל", "ארגמן", "ארז", "אריאל", "ארסוף", "אשבול", "אשבל", "אשדוד", "אשדות יעקב", "אשדות יעקב", "אשחר", "אשכולות", "אשל הנשיא", "אשלים", "אשקלון", "אשרת", "אשתאול", "אתגר", "באקה אל-גרביה", "באר אורה", "באר גנים", "באר טוביה", "באר יעקב", "באר מילכה", "באר שבע", "בארות יצחק", "בארותיים", "בארי", "בוסתן הגליל", "בועיינה-נוג'ידאת", "בוקעאתא", "בורגתה", "בחן", "בטחה", "ביצרון", "ביר אל-מכסור", "ביר הדאג'", "ביריה", "בית אורן", "בית אל", "בית אלעזרי", "בית אלפא", "בית אריה", "בית ברל", "בית ג'ן", "בית גוברין", "בית גמליאל", "בית דגן", "בית הגדי", "בית הלוי", "בית הלל", "בית העמק", "בית הערבה", "בית השיטה", "בית זיד", "בית זית", "בית זרע", "בית חורון", "בית חירות", "בית חלקיה", "בית חנן", "בית חנניה", "בית חשמונאי", "בית יהושע", "בית יוסף", "בית ינאי", "בית יצחק-שער חפר", "בית לחם הגלילית", "בית מאיר", "בית נחמיה", "בית ניר", "בית נקופה", "בית עובד", "בית עוזיאל", "בית עזרא", "בית עריף", "בית צבי", "בית קמה", "בית קשת", "בית רבן", "בית רימון", "בית שאן", "בית שמש", "בית שערים", "בית שקמה", "ביתן אהרן", "ביתר עילית", "בלפוריה", "בן זכאי", "בן עמי", "בני ברק", "בני דקלים", "בני דרום", "בני דרור", "בני יהודה", "בני נצרים", "בני עטרות", "בני עי\"ש", "בני ציון", "בני ראם", "בניה", "בנימינה-גבעת עדה", "בסמ\"ה", "בסמת טבעון", "בענה", "בצרה", "בצת", "בקוע", "בקעות", "בר גיורא", "בר יוחאי", "ברוכין", "ברור חיל", "ברוש", "ברכה", "ברכיה", "ברעם", "ברק", "ברקאי", "ברקן", "ברקת", "בת הדר", "בת חן", "בת חפר", "בת חצור", "בת ים", "בת עין", "בת שלמה", "ג'דיידה-מכר", "ג'ולס", "ג'לג'וליה", "ג'סר א-זרקא", "ג'ת", "גאולי תימן", "גאולים", "גאליה", "גבולות", "גבים", "גבע", "גבע בנימין", "גבע כרמל", "גבעולים", "גבעון החדשה", "גבעות בר", "גבעת אבני", "גבעת אלה", "גבעת ברנר", "גבעת השלושה", "גבעת זאב", "גבעת ח\"ן", "גבעת יואב", "גבעת יערים", "גבעת ישעיהו", "גבעת כ\"ח", "גבעת ניל\"י", "גבעת עוז", "גבעת שמואל", "גבעת שמש", "גבעת שפירא", "גבעתי", "גבעתיים", "גברעם", "גבת", "גדות", "גדיש", "גדעונה", "גדרה", "גונן", "גורן", "גורנות הגליל", "גזית", "גזר", "גיאה", "גיבתון", "גיזו", "גילון", "גילת", "גינוסר", "גיניגר", "גינתון", "גיתה", "גיתית", "גלאון", "גלגל", "גליל ים", "גמזו", "גן הדרום", "גן השומרון", "גן חיים", "גן יאשיה", "גן יבנה", "גן נר", "גן שורק", "גן שלמה", "גן שמואל", "גנות", "גנות הדר", "גני הדר", "גני טל", "גני יוחנן", "גני מודיעין", "גני עם", "גני תקווה", "געש", "געתון", "גפן", "גרופית", "גשור", "גשר", "גשר הזיו", "גת רימון", "דאלית אל-כרמל", "דבורה", "דבוריה", "דבירה", "דברת", "דגניה א'", "דגניה ב'", "דוב\"ב", "דולב", "דור", "דורות", "דחי", "דייר אל-אסד", "דייר חנא", "דייר ראפאת", "דימונה", "דישון", "דליה", "דלתון", "דמיידה", "דן", "דפנה", "דקל", "דריג'את", "האון", "הבונים", "הגושרים", "הדר עם", "הוד השרון", "הודיה", "הודיות", "הושעיה", "הזורע", "הזורעים", "החותרים", "היוגב", "הילה", "המעפיל", "הסוללים", "העוגן", "הר אדר", "הר גילה", "הר עמשא", "הראל", "הרדוף", "הרצליה", "הררית", "ורד יריחו", "ורדון", "זבדיאל", "זוהר", "זיקים", "זיתן", "זכרון יעקב", "זכריה", "זמר", "זמרת", "זנוח", "זרועה", "זרזיר", "זרחיה", "ח'ואלד", "חבצלת השרון", "חבר", "חברון", "חגור", "חגי", "חגלה", "חד-נס", "חדיד", "חדרה", "חולדה", "חולון", "חולית", "חולתה", "חוסן", "חוסנייה", "חופית", "חוקוק", "חורה", "חורפיש", "חורשים", "חזון", "חיבת ציון", "חיננית", "חיפה", "חירות", "חלוץ", "חלץ", "חמאם", "חמד", "חמדיה", "חמדת", "חמרה", "חניאל", "חניתה", "חנתון", "חספין", "חפץ חיים", "חפצי-בה", "חצב", "חצבה", "חצור הגלילית", "חצור-אשדוד", "חצר בארותיים", "חצרות חולדה", "חצרות יסף", "חצרות כ\"ח", "חצרים", "חרב לאת", "חרוצים", "חריש", "חרמש", "חרשים", "חשמונאים", "טבריה", "טובא-זנגריה", "טורעאן", "טייבה", "טירה", "טירת יהודה", "טירת כרמל", "טירת צבי", "טל שחר", "טל-אל", "טללים", "טלמון", "טמרה", "טנא", "טפחות", "יאנוח-ג'ת", "יבול", "יבנאל", "יבנה", "יגור", "יגל", "יד בנימין", "יד השמונה", "יד חנה", "יד מרדכי", "יד נתן", "יד רמב\"ם", "ידידה", "יהוד-מונוסון", "יהל", "יובל", "יובלים", "יודפת", "יונתן", "יושיביה", "יזרעאל", "יחיעם", "יטבתה", "ייט\"ב", "יכיני", "ינוב", "ינון", "יסוד המעלה", "יסודות", "יסעור", "יעד", "יעל", "יעף", "יערה", "יפיע", "יפית", "יפעת", "יפתח", "יצהר", "יציץ", "יקום", "יקיר", "יקנעם עילית", "יראון", "ירדנה", "ירוחם", "ירושלים", "ירחיב", "ירכא", "ירקונה", "ישע", "ישעי", "ישרש", "יתד", "יתיר", "כאבול", "כאוכב אבו אל-היג'א", "כברי", "כדורי", "כדיתה", "כוכב השחר", "כוכב יאיר", "כוכב יעקב", "כוכב מיכאל", "כורזים", "כחל", "כחלה", "כיסופים", "כישור", "כליל", "כלנית", "כמאנה", "כמהין", "כמון", "כנות", "כנף", "כסיפה", "כסלון", "כסרא-סמיע", "כעביה-טבאש-חג'אג'רה", "כפר אביב", "כפר אדומים", "כפר אוריה", "כפר אחים", "כפר ביאליק", "כפר ביל\"ו", "כפר בלום", "כפר בן נון", "כפר ברא", "כפר ברוך", "כפר גדעון", "כפר גלים", "כפר גליקסון", "כפר גלעדי", "כפר דניאל", "כפר האורנים", "כפר החורש", "כפר המכבי", "כפר הנגיד", "כפר הנוער הדתי", "כפר הנשיא", "כפר הס", "כפר הרא\"ה", "כפר הרי\"ף", "כפר ויתקין", "כפר ורבורג", "כפר ורדים", "כפר זוהרים", "כפר זיתים", "כפר חב\"ד", "כפר חושן", "כפר חיטים", "כפר חיים", "כפר חנניה", "כפר חסידים א'", "כפר חסידים ב'", "כפר חרוב", "כפר טרומן", "כפר יאסיף", "כפר ידידיה", "כפר יהושע", "כפר יונה", "כפר יחזקאל", "כפר יעבץ", "כפר כמא", "כפר כנא", "כפר מונש", "כפר מימון", "כפר מל\"ל", "כפר מנדא", "כפר מנחם", "כפר מסריק", "כפר מצר", "כפר מרדכי", "כפר נטר", "כפר סאלד", "כפר סבא", "כפר סילבר", "כפר סירקין", "כפר עבודה", "כפר עזה", "כפר עציון", "כפר פינס", "כפר קאסם", "כפר קיש", "כפר קרע", "כפר ראש הנקרה", "כפר רופין", "כפר רות", "כפר שמאי", "כפר שמואל", "כפר שמריהו", "כפר תבור", "כפר תפוח", "כרי דשא", "כרכום", "כרם בן זמרה", "כרם בן שמן", "כרם מהר\"ל", "כרם שלום", "כרמי יוסף", "כרמי צור", "כרמי קטיף", "כרמיאל", "כרמיה", "כרמים", "כרמל", "לא רשום", "לבון", "לביא", "לבנים", "להב", "להבות הבשן", "להבות חביבה", "להבים", "לוד", "לוזית", "לוחמי הגיטאות", "לוטם", "לוטן", "לימן", "לכיש", "לפיד", "לפידות", "לקיה", "מאור", "מאיר שפיה", "מבוא ביתר", "מבוא דותן", "מבוא חורון", "מבוא חמה", "מבוא מודיעים", "מבואות ים", "מבואות יריחו", "מבועים", "מבטחים", "מבקיעים", "מבשרת ציון", "מג'ד אל-כרום", "מג'דל שמס", "מגאר", "מגדים", "מגדל", "מגדל העמק", "מגדל עוז", "מגדלים", "מגידו", "מגל", "מגן", "מגן שאול", "מגשימים", "מדרך עוז", "מדרשת בן גוריון", "מדרשת רופין", "מודיעין עילית", "מודיעין-מכבים-רעות", "מולדת", "מוצא עילית", "מוקייבלה", "מורן", "מורשת", "מזור", "מזכרת בתיה", "מזרע", "מזרעה", "מחולה", "מחנה הילה", "מחנה טלי", "מחנה יהודית", "מחנה יוכבד", "מחנה יפה", "מחנה יתיר", "מחנה מרים", "מחנה תל נוף", "מחניים", "מחסיה", "מטולה", "מטע", "מי עמי", "מיטב", "מייסר", "מיצר", "מירב", "מירון", "מישר", "מיתר", "מכורה", "מכחול", "מכמורת", "מכמנים", "מלאה", "מלילות", "מלכיה", "מלכישוע", "מנוחה", "מנוף", "מנות", "מנחמיה", "מנרה", "מנשית זבדה", "מסד", "מסדה", "מסילות", "מסילת ציון", "מסלול", "מסעדה", "מסעודין אל-עזאזמה", "מעברות", "מעגלים", "מעגן", "מעגן מיכאל", "מעוז חיים", "מעון", "מעונה", "מעיליא", "מעין ברוך", "מעין צבי", "מעלה אדומים", "מעלה אפרים", "מעלה גלבוע", "מעלה גמלא", "מעלה החמישה", "מעלה לבונה", "מעלה מכמש", "מעלה עירון", "מעלה עמוס", "מעלה שומרון", "מעלות-תרשיחא", "מענית", "מעש", "מפלסים", "מצדות יהודה", "מצובה", "מצליח", "מצפה", "מצפה אבי\"ב", "מצפה אילן", "מצפה יריחו", "מצפה נטופה", "מצפה רמון", "מצפה שלם", "מצר", "מקווה ישראל", "מרגליות", "מרום גולן", "מרחב עם", "מרכז שפירא", "משאבי שדה", "משגב דב", "משגב עם", "משהד", "משואה", "משואות יצחק", "משכיות", "משמר איילון", "משמר דוד", "משמר הירדן", "משמר הנגב", "משמר העמק", "משמר השבעה", "משמר השרון", "משמרות", "משמרת", "משען", "מתן", "מתת", "מתתיהו", "נאות גולן", "נאות הכיכר", "נאות מרדכי", "נאות סמדר", "נאעורה", "נבטים", "נגבה", "נגוהות", "נהורה", "נהלל", "נהריה", "נוב", "נוגה", "נוה צוף", "נווה", "נווה אבות", "נווה אור", "נווה אטי\"ב", "נווה אילן", "נווה איתן", "נווה דניאל", "נווה זוהר", "נווה זיו", "נווה חריף", "נווה ים", "נווה ימין", "נווה ירק", "נווה מבטח", "נווה מיכאל", "נווה שלום", "נועם", "נוף איילון", "נוף הגליל", "נופים", "נופית", "נופך", "נוקדים", "נורדיה", "נורית", "נחושה", "נחל עוז", "נחלה", "נחליאל", "נחלים", "נחם", "נחף", "נחשולים", "נחשון", "נחשונים", "נטועה", "נטור", "נטע", "נטעים", "נטף", "ניין", "ניל\"י", "ניצן", "ניצן ב'", "ניצני סיני", "ניצני עוז", "ניצנים", "ניר אליהו", "ניר בנים", "ניר גלים", "ניר ח\"ן", "ניר יפה", "ניר יצחק", "ניר ישראל", "ניר משה", "ניר עוז", "ניר עם", "ניר עציון", "ניר עקיבא", "ניר צבי", "נירים", "נירית", "נמרוד", "נס הרים", "נס עמים", "נס ציונה", "נעורים", "נעלה", "נעמ\"ה", "נען", "נערן", "נצר חזני", "נצר סרני", "נצרת", "נשר", "נתיב הגדוד", "נתיב הל\"ה", "נתיב העשרה", "נתיב השיירה", "נתיבות", "נתניה", "סאג'ור", "סאסא", "סביון", "סגולה", "סולם", "סוסיה", "סופה", "סח'נין", "סלמה", "סלעית", "סמר", "סנסנה", "סעד", "סעוה", "סער", "ספיר", "סתריה", "ע'ג'ר", "עבדון", "עברון", "עגור", "עדי", "עדנים", "עוזה", "עוזייר", "עולש", "עומר", "עופר", "עופרה", "עוצם", "עזוז", "עזר", "עזריאל", "עזריה", "עזריקם", "עטרת", "עידן", "עיילבון", "עיינות", "עילוט", "עין איילה", "עין אל-אסד", "עין גב", "עין גדי", "עין דור", "עין הבשור", "עין הוד", "עין החורש", "עין המפרץ", "עין הנצי\"ב", "עין העמק", "עין השופט", "עין השלושה", "עין ורד", "עין זיוון", "עין חוד", "עין חצבה", "עין יהב", "עין יעקב", "עין כרם-בי\"ס חקלאי", "עין כרמל", "עין מאהל", "עין נקובא", "עין עירון", "עין צורים", "עין קנייא", "עין ראפה", "עין שמר", "עין שריד", "עין תמר", "עינת", "עיר אובות", "עכו", "עלומים", "עלי", "עלי זהב", "עלמה", "עלמון", "עמוקה", "עמיחי", "עמינדב", "עמיעד", "עמיעוז", "עמיקם", "עמיר", "עמנואל", "עמקה", "ענב", "עספיא", "עפולה", "עץ אפרים", "עצמון שגב", "עראבה", "עראמשה", "ערב אל נעים", "ערד", "ערוגות", "ערערה", "ערערה-בנגב", "עשרת", "עתלית", "עתניאל", "פארן", "פדואל", "פדויים", "פדיה", "פוריה - כפר עבודה", "פוריה - נווה עובד", "פוריה עילית", "פוריידיס", "פורת", "פטיש", "פלך", "פלמחים", "פני חבר", "פסגות", "פסוטה", "פעמי תש\"ז", "פצאל", "פקיעין חדשה", "פרדס חנה-כרכור", "פרדסיה", "פרוד", "פרזון", "פרי גן", "פתח תקווה", "פתחיה", "צאלים", "צביה", "צבעון", "צובה", "צוחר", "צופיה", "צופים", "צופית", "צופר", "צוקי ים", "צוקים", "צור הדסה", "צור יצחק", "צור משה", "צור נתן", "צוריאל", "צורית", "ציפורי", "צלפון", "צנדלה", "צפריה", "צפרירים", "צפת", "צרופה", "צרעה", "קבוצת יבנה", "קדומים", "קדימה-צורן", "קדמה", "קדמת צבי", "קדר", "קדרון", "קדרים", "קוממיות", "קורנית", "קטורה", "קיסריה", "קלחים", "קליה", "קלנסווה", "קלע", "קציר", "קצר א-סר", "קצרין", "קרית אונו", "קרית ארבע", "קרית אתא", "קרית ביאליק", "קרית גת", "קרית טבעון", "קרית ים", "קרית יערים", "קרית מוצקין", "קרית מלאכי", "קרית נטפים", "קרית ענבים", "קרית עקרון", "קרית שלמה", "קרית שמונה", "קרני שומרון", "קשת", "ראמה", "ראס אל-עין", "ראס עלי", "ראש העין", "ראש פינה", "ראש צורים", "ראשון לציון", "רבבה", "רבדים", "רביבים", "רביד", "רגבה", "רגבים", "רהט", "רווחה", "רוויה", "רוח מדבר", "רוחמה", "רומאנה", "רומת הייב", "רועי", "רותם", "רחוב", "רחובות", "רחלים", "ריחאניה", "ריחן", "ריינה", "רימונים", "רינתיה", "רכסים", "רם-און", "רמות", "רמות השבים", "רמות מאיר", "רמות מנשה", "רמות נפתלי", "רמלה", "רמת גן", "רמת דוד", "רמת הכובש", "רמת השופט", "רמת השרון", "רמת יוחנן", "רמת ישי", "רמת מגשימים", "רמת צבי", "רמת רזיאל", "רמת רחל", "רנן", "רעים", "רעננה", "רקפת", "רשפון", "רשפים", "רתמים", "שאר ישוב", "שבי דרום", "שבי ציון", "שבי שומרון", "שבלי - אום אל-גנם", "שגב-שלום", "שדה אילן", "שדה אליהו", "שדה אליעזר", "שדה בוקר", "שדה דוד", "שדה ורבורג", "שדה יואב", "שדה יעקב", "שדה יצחק", "שדה משה", "שדה נחום", "שדה נחמיה", "שדה ניצן", "שדה עוזיהו", "שדה צבי", "שדות ים", "שדות מיכה", "שדי אברהם", "שדי חמד", "שדי תרומות", "שדמה", "שדמות דבורה", "שדמות מחולה", "שדרות", "שואבה", "שובה", "שובל", "שוהם", "שומרה", "שומריה", "שוקדה", "שורש", "שורשים", "שושנת העמקים", "שזור", "שחר", "שחרות", "שיבולים", "שיטים", "שייח' דנון", "שילה", "שילת", "שכניה", "שלווה", "שלווה במדבר", "שלוחות", "שלומי", "שלומית", "שמיר", "שמעה", "שמרת", "שמשית", "שני", "שניר", "שעב", "שעורים", "שעל", "שעלבים", "שער אפרים", "שער הגולן", "שער העמקים", "שער מנשה", "שערי תקווה", "שפיים", "שפיר", "שפר", "שפרעם", "שקד", "שקף", "שרונה", "שריד", "שרשרת", "שתולה", "שתולים", "תאשור", "תדהר", "תובל", "תומר", "תושיה", "תימורים", "תירוש", "תל אביב - יפו", "תל יוסף", "תל יצחק", "תל מונד", "תל עדשים", "תל קציר", "תל שבע", "תל תאומים", "תלם", "תלמי אליהו", "תלמי אלעזר", "תלמי ביל\"ו", "תלמי יוסף", "תלמי יחיאל", "תלמי יפה", "תלמים", "תמרת", "תנובות", "תעוז", "תפרח", "תקומה", "תקוע", "תרום"]

    const selectPickerNode = $('.citySelect')

    for (city of cityList) {
        const node = $(`<option>${city}</option>`)
        selectPickerNode.append(node)
    }

    selectPickerNode.selectpicker('refresh')

}

async function updateLocation() {
    state.loading.location = true
    toggleLoading()
    try {

        await geoLocation()
        state.location.enabled = true
        state.loading.location = false

        await updateBranches()
        state.location.fetched = true
    } catch (e) {
        state.loading.location = false
        toggleLoading()
        manualLocation()

    }

}

async function geoLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)
            if (position.coords.accuracy > 100000)
                return reject(new Error('accuracy error'))
            state.location.coordinates = position.coords.latitude + ',' + position.coords.longitude
            resolve(position)
        }, (err) => {
            console.warn(err)
            reject(err)
        })
    })

}

function manualLocation() {
    $('#addressModel').modal('toggle')

}

function initCityAddressForm() {
    cityListUpdate()

    $("form[name='addressForm']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            city: "required",
            street: "required",
        },
        // Specify validation error messages
        messages: {
            city: "Please choose your city",
            street: "Please enter your street",
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `
            // invalid - feedback ` class to the error element
            error.addClass("invalid-feedback");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
            $('#addressSave').prop('disabled', true)
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
            $('#addressSave').prop('disabled', false)
        },

    });
}