const colors = ["#49D69D", "#49D69D80", "#44B8F380", "#44B8F3"];

const smallArrow = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.351472 0.298263C0.820101 -0.099421 1.5799 -0.099421 2.04853 0.298263L6 3.65153L9.95147 0.298263C10.4201 -0.099421 11.1799 -0.099421 11.6485 0.298263C12.1172 0.695947 12.1172 1.34072 11.6485 1.7384L6.84853 5.81174C6.3799 6.20942 5.6201 6.20942 5.15147 5.81174L0.351472 1.7384C-0.117157 1.34072 -0.117157 0.695947 0.351472 0.298263Z" fill="#324C3D"/>
</svg>`;

const triangleUp = `<svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 0L10.2631 8.25L0.73686 8.25L5.5 0Z" fill="#101921"/>
</svg>`;



function mainHeaderTemplate() {
  return fakePromise(`<div class="loc-header">
    <div class="triangle">${triangleUp}</div>
    <div class="label">${this.name}</div>
  </div>`);
}

function headerTemplate() {
  const name = this.name;
  const icon = this.icon;

  return loadSvg(icon).then((iconStr) => {
    return `<button class="header-btn">
      <div class="triangle">${triangleUp}</div>
      <div class="icon">
      <div> ${iconStr} </div>
      <div class="label">${name}</div>
      </div>
      
    </button>`;
  });
}

function mainCellTemplate(d) {
  const propName = this.propName;
  return `<div class="location-box">
    ${d[propName] || d.region}
  </div>`;
}

function cellTemplate(d, i, arr) {
  const propName = this.propName;
  const format = this.format || ((m) => m);
  const scale = this.colorScale;
  const rank = d[this.rankProp];
  const color = scale(rank);
  const textColor = "#101921";
  const rankCount = arr.filter(x => x[this.rankProp] === rank).length;
  const prefix = (propName === "Overall" && rankCount > 1) ? "=" : "";

  return `<div class="color-box" style="background-color: ${color}; color: ${textColor};">
    ${prefix}${format(d[propName])}
  </div>`;
}

function sortFunc(a, b, order) {
  let orderFunc = order == "asc" ? "ascending" : "descending";

  return d3[orderFunc](a[this.rankProp], b[this.rankProp]);
}

function getHeaders(data) {
  const columns = [
    {
      id: 1,
      isMainColumn: true,
      name: "",
      propName: "borough",
      rankProp: "borough",
      description: "",
      icon: "",
      class: "",
      cellTemplate: mainCellTemplate,
      headerTemplate: mainHeaderTemplate,
    },
    {
      id: 2,
      name: "Overall",
      propName: "overall ranking",
      rankProp: "overall rating",
      description: "",
      order: "asc",
      icon: "./images/star.svg",
      class: "",
      infoOrder: 6,
      cellTemplate,
      sort: sortFunc,
      headerTemplate,
    },
    {
      id: 3,
      name: "Spaces",
      propName: "total available spaces",
      rankProp: "total available spaces rank",
      description: "",
      icon: "./images/spaces.svg",
      class: "",
      infoOrder: 1,
      format: formatThousand,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 4,
      name: "Price",
      propName: "average hourly price",
      rankProp: "average hourly price rank",
      description: "",
      icon: "./images/price.svg",
      infoOrder: 2,
      class: "",
      format: (price) => { return `£${price}` },
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 5,
      name: "Locations",
      propName: "number of locations",
      rankProp: "number of locations rank",
      icon: "./images/locations.svg",
      description: "",
      infoOrder: 3,
      class: "",
      format: formatThousand,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 6,
      name: "Rating",
      propName: "average rating",
      rankProp: "average rating rank",
      description: "",
      icon: "./images/rating.svg",
      infoOrder: 4,
      class: "",
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
  ];

  return columns.map((d, i) => {
    const col = {
      ...d,
      id: i + 1,
    };

    if (!d.isMainColumn) {
      const extent = d3.extent(data, x => x[d.rankProp]);
      col.colorScale = d3.scaleQuantile(extent, colors);
    }

    return col;
  });
}
