import React, { useState } from 'react';
import Buffer from 'buffer';

class ImageUploadV1 extends React.Component <any, any> {
  constructor(props: string) {
    super(props);
    this.state = {
      base64Data: '',
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  };

  handleReaderLoaded = (e:any) => {
    const binaryString = e.target.result;
    this.setState({
      base64Data: btoa(binaryString),
    });
    const { handelCallback } = this.props;
    handelCallback(btoa(binaryString));
  };

  render() {
    const { base64Data } = this.state;
    // this.props.handelCallback(this.state);
    return (
      <div>
        <input
          type="file"
          name="image"
          id="file"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => this.onChange(e)}
        />

        {/* <p>
          base64 string:
          {' '}
          {base64Data}
        </p> */}
        <br />
        {base64Data != null && <img src={`data:image;base64,${base64Data}`} style={{ width: ' 10vh ', marginTop: ' 10px ' }} alt="" />}
      </div>
    );
  }
}

export default ImageUploadV1;
