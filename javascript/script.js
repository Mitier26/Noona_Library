// 문서가 전부 로딩되면 작동하라는 뜻
// window.onload = function () {
// 스크립트 작성 하는 곳
/*
        작성자 : 우명균
    */
// API 키를 배열로 만들어 키가 막혔을 때 다른 키를 사용한다.
// ttbmitier1409002
const API_KEY = `76920f087955f921eb6b6f79d89fc42703ef032dc51e44b6ee7e4be168f2de59`;
let url = new URL(`http://data4library.kr/api/loanItemSrch?authKey=${API_KEY}`);
let url1 = new URL('https://www.nl.go.kr/NL/search/openApi/search.do?');
let bookList = [];
let popularLoanBooksList = [];
// 지역, 성별, 나이 탭을 가져옴
const tabs = document.querySelectorAll("#yb-popular-loan-books-menu button")
console.log("tabs",tabs);
tabs.forEach(mode=>mode.addEventListener("click", (e)=>popularLoanBooksFilter(e)));

const regionMenu = document.querySelectorAll(".region-menu");
const ageMenu = document.querySelectorAll(".age-menu");
const genderMenu = document.querySelectorAll(".gender-menu");

let resultNum = 0;
let page = 1;
const pageSize = 20;
const groupSize = 5;

regionMenu.forEach(region => 
    region.addEventListener("change",(e) => getPopularLoanBooksByRegion(e)));
ageMenu.forEach(age => 
    age.addEventListener("change",(e) => getPopularLoanBooksByAge(e)));
genderMenu.forEach(gender => 
    gender.addEventListener("change",(e) => getPopularLoanBooksByGender(e)));

const popularLoanBooksFilter = (e) => {
    let mode = e.target.id
    console.log("mode", mode);
    let filterHTML = ``
    if(mode === "region"){
        filterHTML = `
        <select class="form-select region-menu" aria-label="Default select example">
            <option selected>전국</option>
            <option value="11">서울</option>
            <option value="21">부산</option>
            <option value="22">대구</option>
            <option value="23">인천</option>
            <option value="24">광주</option>
            <option value="25">대전</option>
            <option value="26">울산</option>
            <option value="29">세종</option>
            <option value="31">경기</option>
            <option value="32">강원</option>
            <option value="33">충북</option>
            <option value="34">충남</option>
            <option value="35">전북</option>
            <option value="36">전남</option>
            <option value="37">경북</option>
            <option value="38">경남</option>
            <option value="39">제주</option>
        </select>`
        document.getElementById('filter').innerHTML=filterHTML
    }else if(mode === "age"){
        filterHTML = `
        <select class="form-select age-menu" aria-label="Default select example">
            <option selected>전체</option>
            <option value="0">영유아(0~5세)</option>
            <option value="6">유아(6~7세)</option>
            <option value="8">초등(8~13세)</option>
            <option value="14">청소년(14~19세)</option>
            <option value="20">20대</option>
            <option value="30">30대</option>
            <option value="40">40대</option>
            <option value="50">50대</option>
            <option value="60">60세 이상</option>
            <option value="-1">미상</option>
        </select>`
        document.getElementById('filter').innerHTML=filterHTML;
    }else if(mode === "gender"){
        filterHTML = `
        <select class="form-select gender-menu" aria-label="Default select example">
            <option selected>전체</option>
            <option value="0">남성</option>
            <option value="1">여성</option>
            <option value="2">미상</option>
        </select>`
        document.getElementById('filter').innerHTML=filterHTML;
    }
    const regionMenu = document.querySelectorAll(".region-menu");
    const ageMenu = document.querySelectorAll(".age-menu");
    const genderMenu = document.querySelectorAll(".gender-menu"); 
    regionMenu.forEach(region => 
        region.addEventListener("change",(e) => getPopularLoanBooksByRegion(e)));
    ageMenu.forEach(age => 
        age.addEventListener("change",(e) => getPopularLoanBooksByAge(e)));
    genderMenu.forEach(gender => 
        gender.addEventListener("change",(e) => getPopularLoanBooksByGender(e)));
}

const getPopularLoanBooks = async () => {
    url.searchParams.set('format', 'json');
    url.searchParams.set('startDt', '2024-01-01');
    url.searchParams.set('endDt', '2024-02-29');

    getPopularLoanBooksData()
};

const getPopularLoanBooksData = async() => {
    url.searchParams.set("pageNo", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    popularLoanBooksList = data.response.docs;
    resultNum = data.response.resultNum;
    popularLoanBooksRender();
    paginationRender();
}

const getPopularLoanBooksByRegion = async(e) => {
    const region = e.target.value;
    console.log("region", region);
    url.searchParams.set('region', region);
    getPopularLoanBooksData();
};

const getPopularLoanBooksByAge = async(e) => {
    const age = e.target.value;
    console.log("age", age);
    url.searchParams.set('age', age);
    getPopularLoanBooksData();
}

const getPopularLoanBooksByGender = async(e) => {
    const gender = e.target.value;
    console.log("gender", gender);
    url.searchParams.set('gender', gender);
    getPopularLoanBooksData();
}

getPopularLoanBooks();

const popularLoanBooksRender = () => {
    const popularLoanBooksHTML = popularLoanBooksList.map(
        (book)=>
            `<div class="card" style="width: 14.5rem;">
        <div class = "yb-books-ranking">${book.doc.ranking}</div>
        <img src=${book.doc.bookImageURL} class="card-img-top" alt="..."> <!-- 책표지 URL-->
        <div class="card-body">
          <div class="card-title">${book.doc.bookname}</div>
          <div class="card-text">${book.doc.authors}</div>
          <div class="card-text">출판사 : ${book.doc.publisher}</div>
          <div class="card-text">출판년도 : ${book.doc.publication_year}</div>
        </div>
    </div>`
    ).join("");
    document.getElementById('yb-popular-loan-books').innerHTML=popularLoanBooksHTML
}

const paginationRender=()=>{
    //resultNum
    //page
    //pageSize
    //groupSize
    //totalPages
    const totalPages = Math.ceil(resultNum/pageSize);
    //pageGroup
    const pageGroup = Math.ceil(page/groupSize);
    //lastPage
    let lastPage = pageGroup * groupSize;
    if(lastPage<totalPages){
        lastPage=totalPages
    }

    //firstPage
    const firstPage = lastPage - (groupSize - 1)<=0 ? 1 : lastPage - (groupSize - 1);
    
    let paginationHTML = ``


    if(firstPage >= 6){
        paginationHTML = `<a class="page-link" onclick = "moveToPage(1)" aria-label="First-Page">
        <span aria-hidden="true">&laquo;</span>
      </a><a class="page-link" onclick = "moveToPage(${page-1})" aria-label="Previous">
        <span aria-hidden="true">&lt;</span></a>`;
    }

  for(let i=firstPage;i<=lastPage;i++){
    paginationHTML+=`<li class="page-item" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
  }

  if(lastPage<resultNum){
    paginationHTML+=`<a class="page-link" onclick = "moveToPage(${page+1})" aria-label="Next">
<span aria-hidden="true">&gt;</span>
</a><a class="page-link" onclick = "moveToPage(${resultNum})"aria-label="Last-Page">
<span aria-hidden="true">&raquo;</span>
</a>`
}
    document.querySelector(".pagination").innerHTML=paginationHTML;
}

const moveToPage = (pageNum) => {
    console.log("moveToPage", pageNum);
    page = pageNum;
    getPopularLoanBooksData();
}

