const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading =$('header h2');
const cdThumb =$('.cd-thumb');
const audio =$('#audio'); 


const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');

const nextBtn =$('.btn-next');
const prevBtn =$('.btn-prev');
const randomBtn = $('.btn-random');

const repeatBtn =$('.btn-repeat');
const playlist = $('.playlist');

const PLAYER_STORAGE_KEY = 'GP_PLAYER';

const app ={
    currentIndex: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,

    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig:function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },


    songs: [
        {
            name:'At My Worst',
            singer:'Pink Sweat$',
            path:'./assets/music/song1.mp3',
            image:'./assets/img/1.jpg'
        },
        {
            name:'Can\' Take My Eyes Off You',
            singer:'Joseph Vincent',
            path:'./assets/music/song2.mp3',
            image:'./assets/img/2.jfif'
        },
        {
            name:'Dusk Till Dawn',
            singer:'Zayn, Sia',
            path:'./assets/music/song3.mp3',
            image:'./assets/img/3.jfif'
        },
        {
            name:'Let Her Go',
            singer:'Passenger',
            path:'./assets/music/song4.mp3',
            image:'./assets/img/4.jpg'
        },
        {
            name:'Memories',
            singer:'Maroon 5',
            path:'./assets/music/song6.mp3',
            image:'./assets/img/6.jpg'
        },
        {
            name:'Salt',
            singer:'Ava Max',
            path:'./assets/music/song7.mp3',
            image:'./assets/img/7.jpg'
        },
        {
            name:'Someone You Loved',
            singer:'Lewis Capaldi',
            path:'./assets/music/song8.mp3',
            image:'./assets/img/8.jfif'
        },
        {
            name:'Love Yourself',
            singer:'Justin Bieber',
            path:'./assets/music/song5.mp3',
            image:'./assets/img/5.jpg'
        },
        {
            name:'Something Just Like This',
            singer:'The Chainsmokers',
            path:'./assets/music/song9.mp3',
            image:'./assets/img/9.jfif'
        },
        {
            name:'Sugar',
            singer:'Maroon 5',
            path:'./assets/music/song10.mp3',
            image:'./assets/img/10.jpg'
        },
    ],
    
    defineProperties: function () {
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex];
            },     
        });
    },

    loadCurrentSong:function () {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    render:function(){
        const html =this.songs.map((song,index)=>{
            return ` 
            <div class="song ${index === this.currentIndex?'active':''}" data-index="${index}">
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>`
        })
        playlist.innerHTML = html.join('');
    },

    handleEvents:function(){
        const cdWidth = cd.offsetWidth;
        const _this  = this;//Gán lại biến cho biến this bên ngoài (tức là app)

                //Xử lý CD quay và dừng 
               const cdThumbAnimate=cdThumb.animate([{
                    transform: 'rotate(360deg)'
                }],{
                    duration: 10000, //10s
                    iterations:Infinity,
                })
                cdThumbAnimate.pause();


        //Xử lý phóng to thu nhỏ khi scroll
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth -scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lý khi click play

        playBtn.onclick=function(){
            //Đã gán lại ở dòng 112 nên _this này chính là app 
            //Còn nếu ta ghi this trực tiếp thì khi đó this chính là playBtn;

            if(_this.isPlaying){
                audio.pause();
            }
            else{           
                audio.play();
            }

            //Khi bài hát được play
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }


            //Khi bài hát được dừng
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }

            //Khi tiến độ bài hát thay đổi khi play
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }

            //Xử lý khi tua xong
            progress.oninput = function(e){
                const seekTime  = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }

        }

        //Khi next bài hát
        nextBtn.onclick = function(){
            if((_this.isRepeat && _this.isRandom)||_this.isRepeat)
            {
                _this.playNowSong();
                
            }
            else if(_this.isRandom)
            {
                _this.playRandomSong();
            }
            else
            {
                _this.nextSong();

            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();       
        }

        
        //Khi previous bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom)
            {
                _this.playRandomSong();
            }
            else
            {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();       
        }

        //Bấm nút random sẽ hiện đỏ, Xử lý bật tắt random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom);
            //Xài toggle để nếu true thì add, false thì remove
            randomBtn.classList.toggle('active',_this.isRandom);
        }


        //Khi kết thúc thì bài hát tự next
        audio.onended = function(){
            
            if((_this.isRepeat && _this.isRandom)||_this.isRepeat)
            {
                _this.setConfig('isRepeat',_this.isRepeat);
                audio.play();
                _this.render();
                _this.scrollToActiveSong();   
            }
            else if(_this.isRandom && !_this.isRepeat)
            {
                _this.setConfig('isRandom',_this.isRandom);
                _this.playRandomSong();
                audio.play();
                _this.render();
                _this.scrollToActiveSong();   
            }
            else
            {
                _this.nextSong();
                audio.play();
                _this.render();
                _this.scrollToActiveSong();   
            }
        }


        //Xử lý lặp lại một bài hát
        repeatBtn.onclick = function(){
            //Làm tương tự như repeat
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }


        //Lắng nghe sự kiện khi nhấn vào tên bài hát
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');

            //closet trả về chính nó hoặc thẻ cha của nó
            if(songNode || e.target.closest('.option'))
            {   
                //Xử lý khi click vào bài hát
                if(e.target.closest('.song:not(.active)')){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //Xử lý khi click vào option
                if( e.target.closest('.option')){

                }
            }
        }
    },
     //Play random song
     playRandomSong:function(){
         let newIndex ;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }while(newIndex === this.currentIndex || newIndex + 1 === this.currentIndex || newIndex - 1 === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    //scrollToActiveSong , để thanh cuộn chạy theo khi next hoặc lùi
    scrollToActiveSong:function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'end',
            });
      },100)
    },

    loadConfig:function(){
        this.isRandom = this.config.isRandom;
        this.repeat = this.config.repeat;
    },


    playNowSong:function(){
        this.currentIndex=app.currentIndex;
        this.loadCurrentSong();
    },

    nextSong:function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    }, 
    prevSong:function () {
        this.currentIndex--;
        if(this.currentIndex <0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    }, 



    start:function(){
        //Định nghĩa các thuộc tính cho object này
        this.defineProperties();

        //Lắng nghe và xử lý các sự kiện trong DOM event
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render lại playlists bài hát
        this.render();

        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // //Hiển thị trạng thái ban đầu của button repeat
        repeatBtn.classList.toggle('active',this.isRepeat);
        randomBtn.classList.toggle('active',this.isRandom);
    }
}

app.start();

