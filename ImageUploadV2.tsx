import React from 'react';

export default class ImageUploadV2 extends React.Component <any, any> {
  constructor(props: string) {
    super(props);
    this.state = {
      compressUrl: '',
    };
  }

  changeFile = (event:any) => {
    const thisone = this;

    const file = event.target.files[0];

    if (file.type.indexOf('image') === 0) {
      const reader = new FileReader();
      const img:any = new Image();

      reader.readAsDataURL(file);
      reader.onload = function (e) {
        img.src = e.target!.result;
        thisone.setState({
          originUrl: e.target!.result,
        });
      };
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const originWidth = img.width;
        const originHeight = img.height;
        const maxWidth = 300;
        const maxHeight = 300;

        let targetWidth = originWidth;
        let targetHeight = originHeight;

        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        context!.clearRect(0, 0, targetWidth, targetHeight);
        context!.drawImage(img, 0, 0, targetWidth, targetHeight);
        const newUrl = canvas.toDataURL('image/jpeg', 1);

        thisone.setState({
          compressUrl: newUrl,
        });

        thisone.props.handelCallback(newUrl);
      };
    }
  };

  render() {
    const { compressUrl } = this.state;

    return (
      <div>
        <input id="file" accept="image/*" type="file" onChange={(e) => this.changeFile(e)} />
        <br />
        <img id="img" src={compressUrl} alt="" style={{ width: ' 10vh ', marginTop: ' 10px ' }} />
      </div>
    );
  }
}
