function looknewmail() {
  var threads = GmailApp.search('is:unread subject:"【速報情報】カード利用お知らせメール"');
  GmailApp.markThreadsRead(threads);
  if (threads.length>0) {
    var d = new Date();
    var m = ("0" + (d.getMonth()+1)).slice(0,2);
    var lstD = d.getFullYear() + "/" + m + "/01";
    var msg = GmailApp.search('subject:"【速報情報】カード利用お知らせメール" after:'+ lstD);
    var subTtl = [];
    for (var i=0;i<msg.length;i++) {
      var pbdy = msg[i].getMessages()[0].getPlainBody();
      var stt = pbdy.indexOf("＜速報情報＞")+6;
      var end = pbdy.indexOf("ご利用",stt);
      subTtl[i] = arr2sum(pbdy.slice(stt,end));
    }
    var a = subTtl[0];
    var b = arr2sum(subTtl);
    var c = "";
    var d = "";
    if (b>20000) {
      c = '<table width="100%" height="100%"><tr>'
        + '<td width="100%" height="100%" bgcolor="red">';
      d = '<font size="5">カードの使用をただちに停止して下さい．</font>'
        + '</td></tr></table>';
    }
    var addrs = "xxxxxx@xxxxxxx.xxx";
    var sbjct = "今月累計使用金額 " + b + " 円";
    var hbody = c + "先ほど " + a +" 円 決済しました．<br>"
              + "今月はすでに " + b + " 円 決済しています．<br>" + d;
    GmailApp.sendEmail(
      addrs,
      sbjct,
      'html error',
      {
        from:     addrs,
        htmlBody: hbody,
        name:     'name'
      }
    );
    GmailApp.moveThreadsToTrash(GmailApp.search('is:inbox is:read subject:"今月累計使用金額"'));
    Logger.log("mail sent");
  } else {
    Logger.log("no new use of card");
  }
  GmailApp.moveThreadsToTrash(GmailApp.search('subject:"【速報情報】カード利用お知らせメール" before:'+ lstD));
}

function arr2sum(b) {
  var i;
  if (typeof b == "string") {
    i = b.replace(/((■利用日).*)/g, "").replace(/(\n|\r|,)/g, "")
         .replace(/■利用金額: /g,"").replace(/ 円/g,",")
         .slice(0,-1).split(",");
  } else if (typeof b == "object") {
    i = b;
  }
  i = i.map(function (element) { return Number(element); });
  i = i.reduce(function(p, c) { return p + c; });
  return i;
}
