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
        const _this  = this;//G??n l???i bi???n cho bi???n this b??n ngo??i (t???c l?? app)

                //X??? l?? CD quay v?? d???ng 
               const cdThumbAnimate=cdThumb.animate([{
                    transform: 'rotate(360deg)'
                }],{
                    duration: 10000, //10s
                    iterations:Infinity,
                })
                cdThumbAnimate.pause();


        //X??? l?? ph??ng to thu nh??? khi scroll
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth -scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //X??? l?? khi click play

        playBtn.onclick=function(){
            //???? g??n l???i ??? d??ng 112 n??n _this n??y ch??nh l?? app 
            //C??n n???u ta ghi this tr???c ti???p th?? khi ???? this ch??nh l?? playBtn;

            if(_this.isPlaying){
                audio.pause();
            }
            else{           
                audio.play();
            }

            //Khi b??i h??t ???????c play
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }


            //Khi b??i h??t ???????c d???ng
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }

            //Khi ti???n ????? b??i h??t thay ?????i khi play
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }

            //X??? l?? khi tua xong
            progress.oninput = function(e){
                const seekTime  = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }

        }

        //Khi next b??i h??t
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

        
        //Khi previous b??i h??t
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

        //B???m n??t random s??? hi???n ?????, X??? l?? b???t t???t random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom);
            //X??i toggle ????? n???u true th?? add, false th?? remove
            randomBtn.classList.toggle('active',_this.isRandom);
        }


        //Khi k???t th??c th?? b??i h??t t??? next
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


        //X??? l?? l???p l???i m???t b??i h??t
        repeatBtn.onclick = function(){
            //L??m t????ng t??? nh?? repeat
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }


        //L???ng nghe s??? ki???n khi nh???n v??o t??n b??i h??t
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');

            //closet tr??? v??? ch??nh n?? ho???c th??? cha c???a n??
            if(songNode || e.target.closest('.option'))
            {   
                //X??? l?? khi click v??o b??i h??t
                if(e.target.closest('.song:not(.active)')){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //X??? l?? khi click v??o option
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

    //scrollToActiveSong , ????? thanh cu???n ch???y theo khi next ho???c l??i
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
        //?????nh ngh??a c??c thu???c t??nh cho object n??y
        this.defineProperties();

        //L???ng nghe v?? x??? l?? c??c s??? ki???n trong DOM event
        this.handleEvents();

        //T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong();

        //Render l???i playlists b??i h??t
        this.render();

        //G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig();

        // //Hi???n th??? tr???ng th??i ban ?????u c???a button repeat
        repeatBtn.classList.toggle('active',this.isRepeat);
        randomBtn.classList.toggle('active',this.isRandom);
    }
}

app.start();

