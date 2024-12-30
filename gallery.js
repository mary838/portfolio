var $REVECHAT_MEDIA_GALLERY = window.$REVECHAT_MEDIA_GALLERY || {} ;

$REVECHAT_MEDIA_GALLERY = {
  rotateDegree:0,
  init: function () {
    jQuery(".lightboxed").lightboxed();
    this.bindEvents();
  },
  reset:function() {
    jQuery(".lightboxed").lightboxed({
      fixedNavigation: true
  });
  },

  setRotateDegree:function (value) {
    // {{ transform: `rotate(${this.props.rotationDegree}deg)
    this.rotateDegree += value;
    var selector = $("#lightboxed--content .lightboxed--frame.lightboxed--active");
    if (selector.length == 0) {
      $("#lightboxed--content .lightboxed--frame").css('transform', `rotate(${this.rotateDegree}deg` );
    } else {
      $("#lightboxed--content .lightboxed--frame.lightboxed--active").css('transform', `rotate(${this.rotateDegree}deg` );
    }
  },

  updateToolTipTexts:function (client_locale) {
    $('#downloadFile').find('.gallery-tooltiptext').text(client_locale.gallery_module.download);
    $('#replyBtn').find('.gallery-tooltiptext').text(client_locale.gallery_module.quote_reply);
    $('#rotateBtn').find('.gallery-tooltiptext').text(client_locale.gallery_module.rotate);
    $('#closeBtn').find('.gallery-tooltiptext').text(client_locale.gallery_module.close);
  },

  resetRotateDegree:function () {
    this.rotateDegree= 0; 
    $("#lightboxed--content .lightboxed--frame").css('transform', `rotate(${this.rotateDegree}deg` )
  },

  getProfilePhoto:function(message, windowIframe){
    
    var profilePhoto;

    if ([1945,4096].includes(message.type)) {
      if (message.dir == 'to') {
        profilePhoto = windowIframe.contentWindow.CONFIG.BOT_PICTURE_ROOT_PATH + (message.senderPhoto ? message.senderPhoto: 'BOT-Avatar-101.png');
      } else if(message.dir == 'from') {
        
      } else {
        profilePhoto = windowIframe.contentWindow.CONFIG.BOT_PICTURE_ROOT_PATH + (message.senderPhoto ? message.senderPhoto: 'BOT-Avatar-101.png');
      }
    }
    else if ( message.dir == 'from') {
    
    } else {
      if(!message.isTriggeredMsg) {
        profilePhoto = message.senderPhoto?(windowIframe.contentWindow.CONFIG.PROFILE_PICTURE_ROOT_PATH + (message.senderPhoto)):
        ("https://" + windowIframe.contentWindow.CONFIG.CDN_ROOT_DOMAIN + "/client/images/agent-profile-img.png");
      } else if(message.isTriggeredMsg) {
        profilePhoto = windowIframe.contentWindow.CONFIG.CHAT_BUTTON_IMG_ROOT_PATH + (windowIframe.contentWindow.$_REVECHAT.WidgetAttribute.attr_home_view.brand_logo || 'b-logo.svg');
      }
    }
    return profilePhoto;
  },
  updateSenderInfo:function (messageId) {
    var windowIframe = window.parent.document.getElementById(
      "reve-chat-widget-holder"
    );
    var messageId = messageId ? messageId : $REVECHAT_MEDIA_GALLERY.getCurrentMessageId();
    var message = windowIframe.contentWindow.ChatHistoryCache.getOne(messageId);
    
    console.warn(message);

    var senderName;
    var sendingTime = new Date(message.timestamp);
    sendingTime = sendingTime.toLocaleString([], {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit', minute:'2-digit'});
    sendingTime = sendingTime.replaceAll('/','-');

    var profilePhoto = this.getProfilePhoto(message, windowIframe);

    if ([1945,4096].includes(message.type)) {
      if (message.dir == 'to') {
        senderName = message.body.message[0].senderName || 'Bot';
      } else if(message.dir == 'from') {
        senderName = message.body.message[0].senderName ||  windowIframe.contentWindow.client_locale.gallery_module.You;
      } else {
        senderName = message.body.message[0].senderName || 'Bot';
      }
    }
    else if ( message.dir == 'from') {
      senderName = message.senderName || message.vname || windowIframe.contentWindow.client_locale.gallery_module.You;
    } else {
      senderName = message.senderName || message.agentName || 'Agent';
    }
    
    $('#senderName').html(senderName);
    $('#sendingTime').html(sendingTime);
    if (profilePhoto) {
      $("#profilePhoto").attr("src", profilePhoto);
      $('.user-section-left').show();
      $("#nameInitial").hide();
      $("#profilePhoto").show();

    } else {
      $("#profilePhoto").hide();
      $("#nameInitial").html(senderName?.toUpperCase()?.charAt(0));
      $("#nameInitial").show();
      $('.user-section-left').show();

      var randomColor = [
        "#0058BF",
        "#37A134",
        "#56CCFF",
        "#F28722",
        "#723AA1",
        "#595F65",
        "#D85EAF",
        "#DE383D",
        "#0058bf",
        "#37a134",
        "#56ccff",
        "#f28722",
        "#723aa1",
        "#595f65",
        "#d85eaf",
        "#de383d",
      ];

      $("#nameInitial").css("background", randomColor[Math.floor(Math.random() * 10)]);

      Math.floor(Math.random() * 10);
    
    }
    $('.gallery-popup-header').find('.left').show();
  },

  enableReply:function() {
    $("#replyBtn").show();
  },
  disableReply:function(){
    $("#replyBtn").hide();
  },
  getCurrentMessageId:function () {
    
    var totalImages = $('.gallery-content-container').find('img');
    var messageId;

    if (totalImages.length == 1) {
      messageId = totalImages.attr('messageid');
    } else {
      var thumbs = document.querySelectorAll(
        "#lightboxed--thumbs .lightboxed--thumb"
      );
      var index = 0;
      thumbs.forEach((e) => {
        if (e.classList.contains("lightboxed--active")) {
          var targetImg = document.querySelectorAll(
            ".gallery-content-container img"
          );
          
          messageId = targetImg[index].getAttribute("messageid");
          return messageId;
        }
        index += 1;
      });
    }

    return messageId;
    
  },

  bindEvents: function () {
    $(document).on("click", "#closeBtn", function (event) {
      
      var vdo = document.querySelector("div#lightboxed--content .lightboxed--active video")
			if (vdo) vdo.pause();

      event.preventDefault();
      var galleryIframe = window.parent.document.getElementById(
        "reve-chat-media-gallery"
      );
      $(galleryIframe).hide();
    });

    $(document).on("click", "#lightboxed--bttn_prev,#lightboxed--bttn_next, .lightboxed--thumb", function (event) {
      event.preventDefault();
      $REVECHAT_MEDIA_GALLERY.resetRotateDegree();
      $REVECHAT_MEDIA_GALLERY.updateSenderInfo();
    });


    

    $(document).on("click", "#replyBtn", function (event) {
      var vdo = document.querySelector("div#lightboxed--content .lightboxed--active video")
			if (vdo) vdo.pause();
      
      event.preventDefault();
      var windowIframe = window.parent.document.getElementById(
        "reve-chat-widget-holder"
      );


      var messageId = $REVECHAT_MEDIA_GALLERY.getCurrentMessageId();

      windowIframe.contentWindow.$_REVECHAT.replyingTOMessage = messageId;

      var message = windowIframe.contentWindow.ChatHistoryCache.getOne(windowIframe.contentWindow.$_REVECHAT.replyingTOMessage);
      windowIframe.contentWindow.$_REVECHAT.Ui.Message.addReplyFloatingCard(message);

      var galleryIframe = window.parent.document.getElementById(
          "reve-chat-media-gallery"
          );
      $(galleryIframe).hide();
      
    });
    $(document).on("click", "#downloadFile", function (event) {
      
      event.preventDefault();
      var windowIframe = window.parent.document.getElementById(
        "reve-chat-widget-holder"
      );
      var messageId = $REVECHAT_MEDIA_GALLERY.getCurrentMessageId();
      var targetImg = $(".gallery-content-container").find(`img[messageid=${messageId}]`);
      var filename =  targetImg.attr("data-filename");

      var originalLink =  targetImg.attr("data-link");

      var downloadLink = targetImg.attr("data-link").includes(windowIframe.contentWindow.CONFIG.FILE_DOWNLOAD_PATH)?
      (windowIframe.contentWindow.CONFIG.FILE_DOWNLOAD_PATH_2 + filename):(windowIframe.contentWindow.CoBrowsingConfig.app_proxy_server_url+originalLink);
      
      var isInternal = originalLink.includes(windowIframe.contentWindow.CONFIG.FILE_DOWNLOAD_PATH)?true:false;
      if(isInternal){
        $REVECHAT_MEDIA_GALLERY.downloadURI(downloadLink, filename);
      }
      
    
    });

    $(document).on("click", "#rotateBtn", function (event) {
      
      event.preventDefault();
      $REVECHAT_MEDIA_GALLERY.setRotateDegree(90);
    
    });
    
  },
  downloadURI:function(uri, filename) {
    var link = document.createElement("a");
    link.setAttribute('download', filename);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
 }
};

$REVECHAT_MEDIA_GALLERY.init();
