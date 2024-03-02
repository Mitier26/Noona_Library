
const API_KEY = `76920f087955f921eb6b6f79d89fc42703ef032dc51e44b6ee7e4be168f2de59`;
const API_KEY1 = [`09f34dfde082ce1b964aeba567e3ecaab58fff794ea4607015ef0709449211a1`];
const API_KEY2 = `0d60452df08b29527128ee96f993660c1f3722369b9e8f087b6b69f215762f38`;

let url = new URL(`http://data4library.kr/api/loanItemSrch?authKey=${API_KEY}`);
let url1 = new URL('http://data4library.kr/api/srchBooks?');

let bookList = [];
let popularLoanBooksList = [];

// 지역, 성별, 나이 탭을 가져옴
const tabs = document.querySelectorAll('#yb-popular-loan-books-menu button');
console.log('tabs', tabs);
tabs.forEach((mode) => mode.addEventListener('click', (e) => popularLoanBooksFilter(e)));

let titleSearchList = [];
let authorSearchList = [];
let keywordSearchList = [];

const lineCount = 3;

const regionMenu = document.querySelectorAll('.region-menu');
const ageMenu = document.querySelectorAll('.age-menu');
const genderMenu = document.querySelectorAll('.gender-menu');

let resultNum = 0;
let page = 1;
const pageSize = 1;
const groupSize = 5;

regionMenu.forEach((region) => region.addEventListener('change', (e) => getPopularLoanBooksByRegion(e)));
ageMenu.forEach((age) => age.addEventListener('change', (e) => getPopularLoanBooksByAge(e)));
genderMenu.forEach((gender) => gender.addEventListener('change', (e) => getPopularLoanBooksByGender(e)));
let response;
let date;

$.getJSON(
    'http://api.openweathermap.org/data/2.5/weather?id=1835848&appid=e185eb6e85e051757f1c4c54a4258982&units=metric',
    function (data) {
        //data로 할일 작성
        //alert(data.list[0].main.temp_min)
        let $minTemp = data.main.temp_min;
        let $maxTemp = data.main.temp_max;
        let $cTemp = data.main.temp;
        let $cDate = data.dt;
        let $wIcon = data.weather[0].icon;

        let $now = new Date($.now());

        //alert(new Date($.now()))
        //A.append(B) A요소의 내용 뒤에 B를 추가
        //A.prepend(B) A요소의 내용 앞에 B를 추가
        $('.clowtemp').append($minTemp);
        $('.ctemp').append($cTemp);
        $('.chightemp').append($maxTemp);
        $('.hh').prepend(
            $now.getFullYear() +
                '/' +
                ($now.getMonth() + 1) +
                '/' +
                $now.getDate() +
                '/' +
                $now.getHours() +
                ':' +
                $now.getMinutes()
        );
        $('.cicon').append('<img src="https://openweathermap.org/img/wn/' + $wIcon + '@2x.png">');
    }
);

async function searchBook(keyword) {
    try {
        keyword = '환경';
        url1.searchParams.set('authKey', API_KEY1[0]);
        url1.searchParams.set('pageNo', 1);
        url1.searchParams.set('pageSize', 1);
        url1.searchParams.set('format', 'json');

        // title 검색
        url1.searchParams.set('title', keyword);
        response = await fetch(url1);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        titleSearchList = data.response.docs;
        url1.searchParams.delete('title');

        // author 검색
        url1.searchParams.set('author', keyword);
        response = await fetch(url1);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        authorSearchList = data.response.docs;
        url1.searchParams.delete('author');

        // keyword 검색
        url1.searchParams.set('keyword', keyword);
        response = await fetch(url1);
        if (!response.ok) {
            throw new Error(`책 검색 중 오류 발생: ${response.statusText}`);
        }
        data = await response.json();
        keywordSearchList = data.response.docs;
        url1.searchParams.delete('keyword');

        // if (titleSearchList.length === 0 && authorSearchList.length === 0 && keywordSearchList.length === 0) {
        //     throw new Error('검색어에 해당하는 책이 없습니다.');
        // }

        searchRender();
    } catch (error) {
        console.error(error);
    }
}

function searchRender() {
    let searchTitleBooksHTML = titleSearchList
        .map(
            (book) =>
                `<div class="card" onclick='getBookhj('${book.doc.isbn13}')'>
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                      ? book.doc.authors.split(';')[0].split(':')[1]
                                      : book.doc.authors.split(';')[0]) +
                                  '<br>' +
                                  book.doc.authors.split(';')[1]
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    let searchAuthorBooksHTML = authorSearchList
        .map(
            (book) =>
                `<div class="card" onclick='getBookhj('${book.doc.isbn13}')'>
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                      ? book.doc.authors.split(';')[0].split(':')[1]
                                      : book.doc.authors.split(';')[0]) +
                                  '<br>' +
                                  book.doc.authors.split(';')[1]
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    let searchKeywordBooksHTML = keywordSearchList
        .map(
            (book) =>
                `<div class="card"  onclick='getBookhj('${book.doc.isbn13}')'>
                    <img src="${book.doc.bookImageURL}" alt="" />
                    <ul>
                        <li>제목<span>${
                            book.doc.bookname.split(':')[0].length >= 0
                                ? book.doc.bookname.split(':')[0].slice(0, 8) + '...'
                                : book.doc.bookname.split(':')[0]
                        }</span></li>
                        <li>작가<span>
                        ${
                            book.doc.authors.includes(';')
                                ? (book.doc.authors.split(';')[0].includes(':')
                                      ? book.doc.authors.split(';')[0].split(':')[1]
                                      : book.doc.authors.split(';')[0]) +
                                  '<br>' +
                                  book.doc.authors.split(';')[1]
                                : book.doc.authors.includes(':')
                                ? book.doc.authors.split(':')[1]
                                : book.doc.authors
                        }
                        
                        </span></li>
                    </ul>
                </div>`
        )
        .join('');

    document.getElementById('title-holder').innerHTML = searchTitleBooksHTML;
    document.getElementById('author-holder').innerHTML = searchAuthorBooksHTML;
    document.getElementById('keyword-holder').innerHTML = searchKeywordBooksHTML;
}

// 더 보기
// 키워드, 타이틀, 작가, 가지고 가야한다.
// 어떤 더 보기를 클릭 했는 지 알아야 한다
const moreHolder = document.getElementById('mg-holder2');
let moreList = [];

async function moreSearcher(input) {
    let newUrl = new URL('http://data4library.kr/api/srchBooks?');

    if (input === 'keyword') {
        newUrl.searchParams.set('keyword', searchWord);
    } else if (input === 'author') {
        newUrl.searchParams.set('author', searchWord);
    } else if (input === 'title' || input == null || input === '') {
        newUrl.searchParams.set('title', searchWord);
    }

    newUrl.searchParams.set('pageSize', itemCountCalculator());

    data = await response.json();
    moreList = data.response.docs;
}

function moreRender() {}

const getPopularLoanBooks = async () => {
    url.searchParams.set('format', 'json');
    url.searchParams.set('startDt', '2024-01-01');
    url.searchParams.set('endDt', '2024-02-29');

    getPopularLoanBooksData();
};

const getPopularLoanBooksData = async () => {
    url.searchParams.set('pageNo', page);
    url.searchParams.set('pageSize', pageSize);
    const response = await fetch(url);
    const data = await response.json();
    console.log('data:', data);
    popularLoanBooksList = data.response.docs;
    resultNum = data.response.resultNum;
    popularLoanBooksRender();
    paginationRender();
};

const getPopularLoanBooksByRegion = async (e) => {
    const region = e.target.value;
    console.log('region', region);
    url.searchParams.set('region', region);
    getPopularLoanBooksData();
};

const getPopularLoanBooksByAge = async (e) => {
    const age = e.target.value;
    console.log('age', age);
    url.searchParams.set('age', age);
    getPopularLoanBooksData();
};

// 한 페이지에 표시할 책의 수
function itemCountCalculator() {
    let result = 0;
    if (window.innerWidth < 451) result = 10;
    else if (window.innerWidth < 768) result = 10;
    else if (window.innerWidth < 992) result = 3 * lineCount;
    else if (window.innerWidth < 1200) result = 4 * lineCount;
    else if (window.innerWidth < 1400) result = 5 * lineCount;
    else if (window.innerWidth >= 1400) result = 6 * lineCount;

    console.log(result);
    return result;
}

const getPopularLoanBooksByGender = async (e) => {
    const gender = e.target.value;
    console.log('gender', gender);
    url.searchParams.set('gender', gender);
    getPopularLoanBooksData();
};

window.addEventListener('resize', itemCountCalculator);

// 검색창 부분
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchType = document.querySelectorAll('.search-type');
let searchWord = '';
// 검색 타입 버튼
searchType.forEach((btn) => {
    btn.addEventListener('click', function () {
        console.log(btn.id);
    });
});

// 검색 하기 버튼
searchBtn.addEventListener('click', function () {
    searchWord = searchInput.value.trim();

    if (!searchWord) {
        const returnVal = prompt('검색어를 입력해 주세요');

        if (returnVal) {
            searchInput.value = returnVal;
            console.log(returnVal);
            searchBook(returnVal);
        }
    } else {
        console.log(searchWord);
        searchBook(searchWord);
    }
});

// getPopularLoanBooks();

const popularLoanBooksRender = () => {
    const popularLoanBooksHTML = popularLoanBooksList
        .map(
            (book) =>
                `<div class="card" style="width: 14.5rem;" data-bs-toggle="modal"
        data-bs-target="#exampleModal" onclick="getBookhj('${book.doc.isbn13}')">
        <div class = "yb-books-ranking">${book.doc.ranking}</div>
        <img src=${book.doc.bookImageURL} class="card-img-top" alt="..."> <!-- 책표지 URL-->
        <div class="card-body">
            <div class="card-title">${book.doc.bookname}</div>
            <div class="card-text">${book.doc.authors}</div>
            <div class="card-text">출판사 : ${book.doc.publisher}</div>
            <div class="card-text">출판년도 : ${book.doc.publication_year}</div>
        </div>
    </div>`
        )
        .join('');
    document.getElementById('yb-popular-loan-books').innerHTML = popularLoanBooksHTML;
};

const paginationRender = () => {
    //resultNum
    //page
    //pageSize
    //groupSize
    //totalPages
    const totalPages = Math.ceil(resultNum / pageSize);
    //pageGroup
    const pageGroup = Math.ceil(page / groupSize);
    //lastPage
    let lastPage = pageGroup * groupSize;
    if (lastPage < totalPages) {
        lastPage = totalPages;
    }

    //firstPage
    const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    let paginationHTML = ``;

    if (firstPage >= 6) {
        paginationHTML = `<a class="page-link" onclick = "moveToPage(1)" aria-label="First-Page">
        <span aria-hidden="true">&laquo;</span>
    </a><a class="page-link" onclick = "moveToPage(${page - 1})" aria-label="Previous">
        <span aria-hidden="true">&lt;</span></a>`;
    }

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }
    if (lastPage < totalPages) {
        paginationHTML += `<a class="page-link" onclick = "moveToPage(${page + 1})" aria-label="Next">
<span aria-hidden="true">&gt;</span>
</a><a class="page-link" onclick = "moveToPage(${totalPages})"aria-label="Last-Page">
<span aria-hidden="true">&raquo;</span>
</a>`;
    }
    document.querySelector('.pagination').innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
    console.log('movetopage', pageNum);
    page = pageNum;
    getPopularLoanBooksData();
};

// 모달
const getBookhj = async (isbn13) => {
    const url2 = new URL(`http://data4library.kr/api/srchBooks?authKey=${API_KEY2}`);
    url2.searchParams.set('isbn13', isbn13);
    url2.searchParams.set('format', 'json');
    const response = await fetch(url2);
    const data = await response.json();
    bookList = data.response.docs;

    console.log(data.response.docs, 'data');
    modalRender();
};

function modalRender() {
    console.log(bookList);
    let booksHTML = bookList
        .map(
            (book) =>
                `<div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">${book.doc.bookname}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
                <img src="${book.doc.bookImageURL}"/>
        </div>
            
        <div class="modal-footer">
            <ur class="modal-items">
                <li class="list-group-item">- 랭킹 :${book.doc.ranking}</li>
                <li class="list-group-item">- 저자명 :${book.doc.authors}</li>
                <li class="list-group-item">- 주제분류 :${book.doc.class_nm}</li>
                <li class="list-group-item">- 출판사 :${book.doc.publisher}</li>
                <li class="list-group-item">- 책소개 :${book.doc.description}</li>
                <li class="list-group-item">- 발행년도 :${book.doc.publication_year}</li>
                <li class="list-group-item">- ISBN :${book.doc.isbn13}</li>
            </ur>
        </div>
        `
        )
        .join('');

    document.getElementById('modal-content').innerHTML = booksHTML;
}
