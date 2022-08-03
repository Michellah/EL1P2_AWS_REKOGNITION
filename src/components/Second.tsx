import React, { useState } from 'react';
import * as AWS from 'aws-sdk';
import './Style.css';
import {  ImageBlob } from 'aws-sdk/clients/rekognition';
import {Link } from 'react-router-dom';


export default function Second() {
  const [image, setImage] = useState<any>();
  const [result, setResult] = useState<any>(null);
      
      //Calls DetectFaces API and shows estimated ages of detected faces
      function DetectFaces(imageData: Blob | ArrayBuffer) {
        console.log(imageData)
        AWS.config.region = process.env.REACT_APP_REGION;
        var rekognition = new AWS.Rekognition();
        var params = {
          Image: {
            Bytes: imageData as ImageBlob
          },
          Attributes: [
            'ALL',
          ]
        };
        rekognition.detectFaces(params, function (err, data) {
          if(err) console.log(err)
          else {
            setResult(Object.entries(data.FaceDetails![0]));
          }
        });
      }
      //Loads selected image and unencodes image bytes for Rekognition DetectFaces API
      function ProcessImage(e: React.ChangeEvent<HTMLInputElement>) {
        AnonLog();
        //var control = document.getElementById("fileToUpload") ;
        var file = e.target.files![0];
        setImage(URL.createObjectURL(file))
    
        // Load base64 encoded image 
        var reader = new FileReader();
        reader.onload = (function (theFile) {
          return function (e: any) {
            var img = document.createElement('img');
            var image = null;
            img.src = e.target?.result;
            var jpg = true;
            try {
              image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
    
            } catch (e) {
              jpg = false;
            }
            if (jpg === false) {
              try {
                image = atob(e.target.result.split("data:image/png;base64,")[1]);
              } catch (e) {
                alert("Not an image file Rekognition can process");
                return;
              }
            }
            if (!image) {
              return;
            }
            //unencode image bytes for Rekognition DetectFaces API 
            var length = image.length;
            var imageBytes = new ArrayBuffer(length);
            var ua = new Uint8Array(imageBytes);
            for (var i = 0; i < length; i++) {
              ua[i] = image?.charCodeAt(i);
            }
            //Call Rekognition  
            DetectFaces(imageBytes);
          };
        })(file);
        reader.readAsDataURL(file);
      }

      function AnonLog() {
        // Configure the credentials provider to use your identity pool
        AWS.config.region = process.env.REACT_APP_REGION; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.REACT_APP_POOL_ID as string,
        });
      }

    return(
        <>
        <div className='appStyle'>
          <div className='body'>
            <h1>FACIAL RECOGNITION</h1>
            <div>
              <label className='labelStyle'>
                Select image
              <input className='inputStyle' type="file"  name="fileToUpload" id="fileToUpload" accept="image/*"
                onChange={(e) =>
                    ProcessImage(e)
                  }/>
              </label>
            </div>
            <div className='bodyStyle'>
              <div id='img'>
                <img src={image} className='imageStyle' alt=''/>
              </div>
              <div id='resultat'>
                <h2>Information</h2>
                {
                  (result || [] ).map(function (k: any) {
                    return (
                      <div className='tableStyle'>
                        <table>
                          <tr>
                            <p className='name'>{k[0]}</p>
                          </tr>
                          <tr>
                            <td className='properties'>
                              {
                                (Object.entries(k[1]) || []).map(function (e: any){
                                
                                return (
                                  <>
                                    <p>{(e[0])} : {(e[1])+""}</p>
                                    {
                                      (Object.entries(e[1])).map(function (element: any){
                                        return (
                                          <>
                                            <p>{JSON.stringify(element[0])} : {JSON.stringify(element[1])}</p>
                                          </>
                                        );
                                      })
                                    }
                                  </>
                                      );
                                })
                              }
                            </td>
                          </tr>
                        </table>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className='footer'>
            <Link to="/">go back</Link>
          </div>
          </div>  
        </>
    );
}
