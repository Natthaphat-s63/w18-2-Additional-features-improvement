import pptxgen from "pptxgenjs";
let rootboxOpts = {
  x: 0,
  y: 0,
  color: "000000",
  bold: true,
  align: "center",
  w: "100%",
  h: "100%",
  fontSize: 32,
};
let contboxOpts = {
  x: "5%",
  y: "20%",
  color: "000000",
  w: "90%",
  h: "80%",
  valign: "top",
  fit: "shrink",
  fontSize: 18,
  bullet: true,
};
let titleOpts = {
  x: "5%",
  y: 0,
  color: "000000",
  w: "90%",
  h: "20%",
  bold: true,
  fontSize: 24,
};

const OverflowSlideContent = (slide, contentText, titleText) => {
  while (contentText.length > 800) {
    let thiscontent = contentText.slice(0, 800);
    let nextcontent = contentText.slice(800);
    slide.addText(thiscontent, contboxOpts);
    slide = slide.addSlide();
    contentText = nextcontent;
    slide.addText(titleText + " [con't]", titleOpts);
  }
  slide.addText(contentText, contboxOpts);
  return slide;
};
const gen_powerpoint = (content) => {
  let pres = new pptxgen();
  let slide = pres.addSlide();

  let rootText = content[0].title;
  if (content[0].use) slide.addText(rootText, rootboxOpts);
  let nxtSlide = slide.addSlide();

  for (let page = 1; page < content.length; page++) {
    if (content[page].haveChild && content[page].use) {
      let titleText = content[page].title;
      nxtSlide.addText(titleText, titleOpts);
      let contentText = content[page].child_use[0]
        ? content[page].childContent[0]
        : "";
      if (contentText.length > 800) {
        nxtSlide = OverflowSlideContent(nxtSlide, contentText, titleText);
        contentText = "";
        if (content[page].childContent.length > 1) {
          nxtSlide = nxtSlide.addSlide();
          nxtSlide.addText(titleText + " [con't]", titleOpts);
        }
      }
      let count_bullet = 1;
      for (let i = 1; i < content[page].childContent.length; i++) {
        if (content[page].child_use[i]) {
          if (content[page].childContent[i].length > 800) {
            nxtSlide = OverflowSlideContent(
              nxtSlide,
              content[page].childContent[i],
              titleText
            );
            nxtSlide = nxtSlide.addSlide();
          } else if (count_bullet % 8 === 0) {
            contentText =
              contentText +
              (contentText !== "" ? "\n" : "") +
              content[page].childContent[i];
            nxtSlide.addText(contentText, contboxOpts);
            nxtSlide = nxtSlide.addSlide();
            contentText = "";
            count_bullet++;
          } else {
            contentText =
              contentText +
              (contentText !== "" ? "\n" : "") +
              content[page].childContent[i];
            count_bullet++;
            continue;
          }
          nxtSlide.addText(titleText + " [con't]", titleOpts);
        }
      }
      nxtSlide.addText(contentText, contboxOpts);
    } else if (
      !content[page].haveChild &&
      content[page].parent === rootText &&
      content[page].use
    ) {
      let titleText = content[0].title;
      let contentText = content[page].title;
      nxtSlide.addText(titleText, titleOpts);
      nxtSlide = OverflowSlideContent(nxtSlide, contentText, titleText);
    } else {
      continue;
    }
    nxtSlide = nxtSlide.addSlide();
  }
  let End = "Thank You";
  nxtSlide.addText(End, rootboxOpts);
  pres.writeFile({ fileName: localStorage.getItem("title") + ".pptx" });
};
export default { gen_powerpoint };
