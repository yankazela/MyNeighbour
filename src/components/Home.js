import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Message } from 'semantic-ui-react/dist/commonjs'
import { updateForm, reinitialise, submitAddress } from '../reducers/home'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import GoogleMap from './GoogleMap'

class Home extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  handleChange (event) {
    let newState = {}
    newState[event.target.name] = event.target.value
    this.props.updateForm(newState)
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.validateAddress(this.props.address)) {
      this.props.submitAddress(this.props)
    } else {
      this.props.updateForm({ errorMessage: 'Invalide address entered', hasError: true })
    }
  }

  loadData (event) {
    const content = this.props.content
    var html = ''
    const name = event.target.name
    if (event.target.id.includes('show-place')) {
      let placeData = content[name].results
      placeData.shift()
      for (var i = 0; i < placeData.length; i++) {
        if (placeData[i].position) {
          html = html + `<div className='row'>
            <div className='col-md-6'>
              <a  name=${name} rel='single-place' id='single-place-${i}'>${placeData[i].title}</a>
            </div>
          </div>`
        }
      }
      document.getElementById('home').innerHTML = html
      ReactDOM.render('', document.getElementById('map'))
      for (var j = 0; j < placeData.length; j++) {
        var s = document.getElementById(`single-place-${j}`)
        if (s) {
          s.onclick = this.loadData
        }
      }
    } else {
      let id = event.target.id.split('-')[2]
      let singlePlace = content[name].results[id]
      let typePlace = name.endsWith('s') ? name.substr(0, name.length - 1) : name
      html = html + `<div className='row'>
            <div className='col-md-6'>
              <small>The <strong>${singlePlace.title}</strong>  ${typePlace} is situated at ${singlePlace.highlightedVicinity}, ${this.getDistance(content.geoCodes.Latitude, content.geoCodes.Longitude, singlePlace.position[0], singlePlace.position[1], 'K')} from your place.</small>
            </div>
          </div>`
      document.getElementById('home').innerHTML = html
      const lat = singlePlace.position[0]
      const lng = singlePlace.position[1]
      ReactDOM.render(
        <GoogleMap
          isMarkerShown
          googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyDsqFE1upfN3ud8CO9zlC8ovmip_mh8cIs&v=3.exp&libraries=geometry,drawing,places'
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px`, width: `50%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          lat={lat}
          lng={lng}
        />, document.getElementById('map'))
    }
  }

  getDistance (lat1, lon1, lat2, lon2, unit) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0
    } else {
      var radlat1 = Math.PI * lat1 / 180
      var radlat2 = Math.PI * lat2 / 180
      var theta = lon1 - lon2
      var radtheta = Math.PI * theta / 180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
      if (dist > 1) {
        dist = 1
      }
      dist = Math.acos(dist)
      dist = dist * 180 / Math.PI
      dist = dist * 60 * 1.1515
      if (unit === 'K') { dist = dist * 1.609344 }
      if (unit === 'N') { dist = dist * 0.8684 }
      return dist.toFixed(1) + ' Km'
    }
  }

  validateAddress (address) {
    var re = /^[`0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -,]{2,45}$/i
    return address.match(re)
  }

  render () {
    const props = this.props
    if (!props.isSubmitting && !props.hasSubmitted && !props.hasError) {
      return (
        <Fragment>
          {/* <div className='wrapper static-page'>
            <div className='app-login'>
              <div className='text-center box shadow-5 animated fadeInLeft b-r-4 p-a-20'>
                <form className='myapp-alerts' role='form' encType='text/plain' onSubmit={this.handleSubmit}>
                  <div class='form-group has-feedback'>
                    <input class='form-control' placeholder='Address' type='text' id='address' name='address' required='' onChange={this.handleChange} />
                    <span class='form-control-feedback'>
                      <i class='fa fa-fw fa-user' />
                    </span>
                  </div>
                  <button name='send' type='submit' >Find</button>
                </form>
                <div id='ion-election-widget' />
              </div>
            </div> */}
          <div className='container emp-profile'>
            <section className='get-in-touch'>
              <h1 className='title'>My Neighborhood</h1>
              <form className='contact-form row' onSubmit={this.handleSubmit}>
                <div className='form-field col-lg-6'>
                  <input id='address' name='address' className='input-text js-input' type='text' placeholder='Address' onChange={this.handleChange} required />
                </div>
                <div className='form-field col-lg-6 '>
                  <input id='suburb' name='suburb' className='input-text js-input' type='text' placeholder='Suburb' onChange={this.handleChange} required />
                </div>
                <div className='form-field col-lg-6 '>
                  <input id='city' name='city' className='input-text js-input' type='text' placeholder='City' onChange={this.handleChange} required />
                </div>
                <div className='form-field col-lg-6 '>
                  <select name='country' className='input-text js-input' id='country' onChange={this.handleChange} >
                    <option value=''>{'Country'}</option>
                    <option value='Afghanistan'>Afghanistan</option>
                    <option value='Åland Islands'>Åland Islands</option>
                    <option value='Albania'>Albania</option>
                    <option value='Algeria'>Algeria</option>
                    <option value='American Samoa'>American Samoa</option>
                    <option value='Andorra'>Andorra</option>
                    <option value='Angola'>Angola</option>
                    <option value='Anguilla'>Anguilla</option>
                    <option value='Antarctica'>Antarctica</option>
                    <option value='Antigua and Barbuda'>Antigua and Barbuda</option>
                    <option value='Argentina'>Argentina</option>
                    <option value='Armenia'>Armenia</option>
                    <option value='Aruba'>Aruba</option>
                    <option value='Australia'>Australia</option>
                    <option value='Austria'>Austria</option>
                    <option value='Azerbaijan'>Azerbaijan</option>
                    <option value='Bahamas'>Bahamas</option>
                    <option value='Bahrain'>Bahrain</option>
                    <option value='Bangladesh'>Bangladesh</option>
                    <option value='Barbados'>Barbados</option>
                    <option value='Belarus'>Belarus</option>
                    <option value='Belgium'>Belgium</option>
                    <option value='Belize'>Belize</option>
                    <option value='Benin'>Benin</option>
                    <option value='Bermuda'>Bermuda</option>
                    <option value='Bhutan'>Bhutan</option>
                    <option value='Bolivia'>Bolivia</option>
                    <option value='Bosnia and Herzegovina'>Bosnia and Herzegovina</option>
                    <option value='Botswana'>Botswana</option>
                    <option value='Bouvet Island'>Bouvet Island</option>
                    <option value='Brazil'>Brazil</option>
                    <option value='British Indian Ocean Territory'>British Indian Ocean Territory</option>
                    <option value='Brunei Darussalam'>Brunei Darussalam</option>
                    <option value='Bulgaria'>Bulgaria</option>
                    <option value='Burkina Faso'>Burkina Faso</option>
                    <option value='Burundi'>Burundi</option>
                    <option value='Cambodia'>Cambodia</option>
                    <option value='Cameroon'>Cameroon</option>
                    <option value='Canada'>Canada</option>
                    <option value='Cape Verde'>Cape Verde</option>
                    <option value='Cayman Islands'>Cayman Islands</option>
                    <option value='Central African Republic'>Central African Republic</option>
                    <option value='Chad'>Chad</option>
                    <option value='Chile'>Chile</option>
                    <option value='China'>China</option>
                    <option value='Christmas Island'>Christmas Island</option>
                    <option value='Cocos (Keeling) Islands'>Cocos (Keeling) Islands</option>
                    <option value='Colombia'>Colombia</option>
                    <option value='Comoros'>Comoros</option>
                    <option value='Congo'>Congo</option>
                    <option value='Congo, The Democratic Republic of The'>Congo, The Democratic Republic of The</option>
                    <option value='Cook Islands'>Cook Islands</option>
                    <option value='Costa Rica'>Costa Rica</option>
                    <option value='Cote D"ivoire'>Cote D'ivoire</option>
                    <option value='Croatia'>Croatia</option>
                    <option value='Cuba'>Cuba</option>
                    <option value='Cyprus'>Cyprus</option>
                    <option value='Czech Republic'>Czech Republic</option>
                    <option value='Denmark'>Denmark</option>
                    <option value='Djibouti'>Djibouti</option>
                    <option value='Dominica'>Dominica</option>
                    <option value='Dominican Republic'>Dominican Republic</option>
                    <option value='Ecuador'>Ecuador</option>
                    <option value='Egypt'>Egypt</option>
                    <option value='El Salvador'>El Salvador</option>
                    <option value='Equatorial Guinea'>Equatorial Guinea</option>
                    <option value='Eritrea'>Eritrea</option>
                    <option value='Estonia'>Estonia</option>
                    <option value='Ethiopia'>Ethiopia</option>
                    <option value='Falkland Islands (Malvinas)'>Falkland Islands (Malvinas)</option>
                    <option value='Faroe Islands'>Faroe Islands</option>
                    <option value='Fiji'>Fiji</option>
                    <option value='Finland'>Finland</option>
                    <option value='France'>France</option>
                    <option value='French Guiana'>French Guiana</option>
                    <option value='French Polynesia'>French Polynesia</option>
                    <option value='French Southern Territories'>French Southern Territories</option>
                    <option value='Gabon'>Gabon</option>
                    <option value='Gambia'>Gambia</option>
                    <option value='Georgia'>Georgia</option>
                    <option value='Germany'>Germany</option>
                    <option value='Ghana'>Ghana</option>
                    <option value='Gibraltar'>Gibraltar</option>
                    <option value='Greece'>Greece</option>
                    <option value='Greenland'>Greenland</option>
                    <option value='Grenada'>Grenada</option>
                    <option value='Guadeloupe'>Guadeloupe</option>
                    <option value='Guam'>Guam</option>
                    <option value='Guatemala'>Guatemala</option>
                    <option value='Guernsey'>Guernsey</option>
                    <option value='Guinea'>Guinea</option>
                    <option value='Guinea-bissau'>Guinea-bissau</option>
                    <option value='Guyana'>Guyana</option>
                    <option value='Haiti'>Haiti</option>
                    <option value='Heard Island and Mcdonald Islands'>Heard Island and Mcdonald Islands</option>
                    <option value='Holy See (Vatican City State)'>Holy See (Vatican City State)</option>
                    <option value='Honduras'>Honduras</option>
                    <option value='Hong Kong'>Hong Kong</option>
                    <option value='Hungary'>Hungary</option>
                    <option value='Iceland'>Iceland</option>
                    <option value='India'>India</option>
                    <option value='Indonesia'>Indonesia</option>
                    <option value='Iran, Islamic Republic of'>Iran, Islamic Republic of</option>
                    <option value='Iraq'>Iraq</option>
                    <option value='Ireland'>Ireland</option>
                    <option value='Isle of Man'>Isle of Man</option>
                    <option value='Israel'>Israel</option>
                    <option value='Italy'>Italy</option>
                    <option value='Jamaica'>Jamaica</option>
                    <option value='Japan'>Japan</option>
                    <option value='Jersey'>Jersey</option>
                    <option value='Jordan'>Jordan</option>
                    <option value='Kazakhstan'>Kazakhstan</option>
                    <option value='Kenya'>Kenya</option>
                    <option value='Kiribati'>Kiribati</option>
                    <option value='Korea, Democratic Peoples Republic of'>Korea, Democratic People's Republic of</option>
                    <option value='Korea, Republic of'>Korea, Republic of</option>
                    <option value='Kuwait'>Kuwait</option>
                    <option value='Kyrgyzstan'>Kyrgyzstan</option>
                    <option value='Lao Peoples Democratic Republic'>Lao People's Democratic Republic</option>
                    <option value='Latvia'>Latvia</option>
                    <option value='Lebanon'>Lebanon</option>
                    <option value='Lesotho'>Lesotho</option>
                    <option value='Liberia'>Liberia</option>
                    <option value='Libyan Arab Jamahiriya'>Libyan Arab Jamahiriya</option>
                    <option value='Liechtenstein'>Liechtenstein</option>
                    <option value='Lithuania'>Lithuania</option>
                    <option value='Luxembourg'>Luxembourg</option>
                    <option value='Macao'>Macao</option>
                    <option value='Macedonia, The Former Yugoslav Republic of'>Macedonia, The Former Yugoslav Republic of</option>
                    <option value='Madagascar'>Madagascar</option>
                    <option value='Malawi'>Malawi</option>
                    <option value='Malaysia'>Malaysia</option>
                    <option value='Maldives'>Maldives</option>
                    <option value='Mali'>Mali</option>
                    <option value='Malta'>Malta</option>
                    <option value='Marshall Islands'>Marshall Islands</option>
                    <option value='Martinique'>Martinique</option>
                    <option value='Mauritania'>Mauritania</option>
                    <option value='Mauritius'>Mauritius</option>
                    <option value='Mayotte'>Mayotte</option>
                    <option value='Mexico'>Mexico</option>
                    <option value='Micronesia, Federated States of'>Micronesia, Federated States of</option>
                    <option value='Moldova, Republic of'>Moldova, Republic of</option>
                    <option value='Monaco'>Monaco</option>
                    <option value='Mongolia'>Mongolia</option>
                    <option value='Montenegro'>Montenegro</option>
                    <option value='Montserrat'>Montserrat</option>
                    <option value='Morocco'>Morocco</option>
                    <option value='Mozambique'>Mozambique</option>
                    <option value='Myanmar'>Myanmar</option>
                    <option value='Namibia'>Namibia</option>
                    <option value='Nauru'>Nauru</option>
                    <option value='Nepal'>Nepal</option>
                    <option value='Netherlands'>Netherlands</option>
                    <option value='Netherlands Antilles'>Netherlands Antilles</option>
                    <option value='New Caledonia'>New Caledonia</option>
                    <option value='New Zealand'>New Zealand</option>
                    <option value='Nicaragua'>Nicaragua</option>
                    <option value='Niger'>Niger</option>
                    <option value='Nigeria'>Nigeria</option>
                    <option value='Niue'>Niue</option>
                    <option value='Norfolk Island'>Norfolk Island</option>
                    <option value='Northern Mariana Islands'>Northern Mariana Islands</option>
                    <option value='Norway'>Norway</option>
                    <option value='Oman'>Oman</option>
                    <option value='Pakistan'>Pakistan</option>
                    <option value='Palau'>Palau</option>
                    <option value='Palestinian Territory, Occupied'>Palestinian Territory, Occupied</option>
                    <option value='Panama'>Panama</option>
                    <option value='Papua New Guinea'>Papua New Guinea</option>
                    <option value='Paraguay'>Paraguay</option>
                    <option value='Peru'>Peru</option>
                    <option value='Philippines'>Philippines</option>
                    <option value='Pitcairn'>Pitcairn</option>
                    <option value='Poland'>Poland</option>
                    <option value='Portugal'>Portugal</option>
                    <option value='Puerto Rico'>Puerto Rico</option>
                    <option value='Qatar'>Qatar</option>
                    <option value='Reunion'>Reunion</option>
                    <option value='Romania'>Romania</option>
                    <option value='Russian Federation'>Russian Federation</option>
                    <option value='Rwanda'>Rwanda</option>
                    <option value='Saint Helena'>Saint Helena</option>
                    <option value='Saint Kitts and Nevis'>Saint Kitts and Nevis</option>
                    <option value='Saint Lucia'>Saint Lucia</option>
                    <option value='Saint Pierre and Miquelon'>Saint Pierre and Miquelon</option>
                    <option value='Saint Vincent and The Grenadines'>Saint Vincent and The Grenadines</option>
                    <option value='Samoa'>Samoa</option>
                    <option value='San Marino'>San Marino</option>
                    <option value='Sao Tome and Principe'>Sao Tome and Principe</option>
                    <option value='Saudi Arabia'>Saudi Arabia</option>
                    <option value='Senegal'>Senegal</option>
                    <option value='Serbia'>Serbia</option>
                    <option value='Seychelles'>Seychelles</option>
                    <option value='Sierra Leone'>Sierra Leone</option>
                    <option value='Singapore'>Singapore</option>
                    <option value='Slovakia'>Slovakia</option>
                    <option value='Slovenia'>Slovenia</option>
                    <option value='Solomon Islands'>Solomon Islands</option>
                    <option value='Somalia'>Somalia</option>
                    <option value='South Africa'>South Africa</option>
                    <option value='South Georgia and The South Sandwich Islands'>South Georgia and The South Sandwich Islands</option>
                    <option value='Spain'>Spain</option>
                    <option value='Sri Lanka'>Sri Lanka</option>
                    <option value='Sudan'>Sudan</option>
                    <option value='Suriname'>Suriname</option>
                    <option value='Svalbard and Jan Mayen'>Svalbard and Jan Mayen</option>
                    <option value='Swaziland'>Swaziland</option>
                    <option value='Sweden'>Sweden</option>
                    <option value='Switzerland'>Switzerland</option>
                    <option value='Syrian Arab Republic'>Syrian Arab Republic</option>
                    <option value='Taiwan, Province of China'>Taiwan, Province of China</option>
                    <option value='Tajikistan'>Tajikistan</option>
                    <option value='Tanzania, United Republic of'>Tanzania, United Republic of</option>
                    <option value='Thailand'>Thailand</option>
                    <option value='Timor-leste'>Timor-leste</option>
                    <option value='Togo'>Togo</option>
                    <option value='Tokelau'>Tokelau</option>
                    <option value='Tonga'>Tonga</option>
                    <option value='Trinidad and Tobago'>Trinidad and Tobago</option>
                    <option value='Tunisia'>Tunisia</option>
                    <option value='Turkey'>Turkey</option>
                    <option value='Turkmenistan'>Turkmenistan</option>
                    <option value='Turks and Caicos Islands'>Turks and Caicos Islands</option>
                    <option value='Tuvalu'>Tuvalu</option>
                    <option value='Uganda'>Uganda</option>
                    <option value='Ukraine'>Ukraine</option>
                    <option value='United Arab Emirates'>United Arab Emirates</option>
                    <option value='United Kingdom'>United Kingdom</option>
                    <option value='United States'>United States</option>
                    <option value='United States Minor Outlying Islands'>United States Minor Outlying Islands</option>
                    <option value='Uruguay'>Uruguay</option>
                    <option value='Uzbekistan'>Uzbekistan</option>
                    <option value='Vanuatu'>Vanuatu</option>
                    <option value='Venezuela'>Venezuela</option>
                    <option value='Viet Nam'>Viet Nam</option>
                    <option value='Virgin Islands, British'>Virgin Islands, British</option>
                    <option value='Virgin Islands, U.S.'>Virgin Islands, U.S.</option>
                    <option value='Wallis and Futuna'>Wallis and Futuna</option>
                    <option value='Western Sahara'>Western Sahara</option>
                    <option value='Yemen'>Yemen</option>
                    <option value='Zambia'>Zambia</option>
                    <option value='Zimbabwe'>Zimbabwe</option>
                  </select>
                </div>
                <div className='form-field col-lg-12'>
                  <input className='submit-btn' type='submit' value='Search' />
                </div>
              </form>
            </section>
          </div>
          {props.hasError &&
            <Message
              error
              header='Errors'
              content={props.errorMessage}
            />
          }
          {/* </div> */}
        </Fragment>
      )
    } else if (props.isSubmitting && !props.hasSubmitted) {
      return (
        <Fragment>
          <div id='circle'>
            <div class='loader' />
          </div>
        </Fragment>
      )
    } else if (props.hasSubmitted) {
      let places = Object.keys(props.content)
      places.shift()
      return (
        <div className='container emp-profile'>
          <form method='post'>
            <div className='row'>
              <div className='col-md-4'>
                <div className='profile-img'>
                  <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog' alt='' />
                  <div className='file btn btn-lg btn-primary'>
                    Change Photo
                    <input type='file' name='file' />
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='profile-head'>
                  <h5>
                    {props.city + ', ' + props.country}
                  </h5>
                  <h6>
                    {props.address + ', ' + props.suburb}
                  </h6>
                  <p className='proile-rating'>RANKINGS : <span>8/10</span></p>
                  <ul className='nav nav-tabs' id='myTab' role='tablist'>
                    <li className='nav-item'>
                      <a className='nav-link active' id='home-tab' data-toggle='tab' href='#home' role='tab' aria-controls='home' aria-selected='true'>About</a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' id='profile-tab' data-toggle='tab' href='#profile' role='tab' aria-controls='profile' aria-selected='false'>Timeline</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-md-2'>
                <input type='submit' className='profile-edit-btn' name='btnAddMore' value='Edit Profile' />
              </div>
            </div>
            <div className='row'>
              <div className='col-md-4'>
                <div className='profile-work'>
                  <p>PLACES AND SERVICES</p>
                  {places.map((place, index) => {
                    return (
                      <div>
                        <a onClick={this.loadData} name={place} id={'show-place-' + index}>{place}</a>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className='col-md-8'>
                <div className='tab-content profile-tab' id='myTabContent'>
                  <div className='tab-pane fade show active' id='home' role='tabpanel' aria-labelledby='home-tab' />
                  <div id='map' />
                  <div className='tab-pane fade' id='profile' role='tabpanel' aria-labelledby='profile-tab'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <label>Experience</label>
                      </div>
                      <div className='col-md-6'>
                        <p>Expert</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <label>Hourly Rate</label>
                      </div>
                      <div className='col-md-6'>
                        <p>10$/hr</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <label>Total Projects</label>
                      </div>
                      <div className='col-md-6'>
                        <p>230</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <label>English Level</label>
                      </div>
                      <div className='col-md-6'>
                        <p>Expert</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <label>Availability</label>
                      </div>
                      <div className='col-md-6'>
                        <p>6 months</p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <label>Your Bio</label><br />
                        <p>Your detail description</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => (state.home)
const mapDispatchToProps = (dispatch) => bindActionCreators({ updateForm, reinitialise, submitAddress }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
