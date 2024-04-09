// import {FormIntegration} from "../src/index";
// import {expect} from 'chai';

// describe('form integration', () => {
//     let form: FormIntegration
//     beforeEach(() => {
//         form = new FormIntegration()
//     })
//     it('Building query string with sub keys etc', () => {
//         const formData = {
//             checkbox: '3',
//             testField: 'TestField',
//             country: 'CZ',
//             product: 'payday',
//             agree: 'yes',
//             cell_phone: '222222222',
//             period: '2',
//             requested_amount: '1000',
//             click_id: "text",
//             spclid: "text",
//             subaccounts: {
//                 sub1: "textsub1",
//                 sub5: "sub5"
//             }
//         }

//         const value = form.buildQueryParametersString(formData, new URLSearchParams('sub2=text2&sub1=text1&first_name=Pasha'), '?first_name=Test2')
//         expect(value).to.equal('sub2=text2&sub1=textsub1&first_name=Test2&checkbox=3&testField=TestField&country=CZ&product=payday&agree=yes&cell_phone=222222222&period=2&requested_amount=1000&click_id=text&spclid=text&sub5=sub5')
//     })


//     it('Testing ONLY_INTEGERS', () => {
//         const value = form.availableCleanups['ONLY_INTEGERS']('1n2m3oj4 j5 6~`!@#$%^&*()_+/*7+/?><,.8z9')
//         expect(value).to.equal('123456789')
//     })


//     it('Building meta data object', () => {
//         const metaData = {
//             "aff": "722ca6702868f800e17ebfd6b27d95f5562faaee",
//             "keyword": "text",
//             "click_id": "text",
//             "spclid": "text",
//             "sub1": "textsub1",
//             "sub5": "sub5"
//         }
//         const value = form.buildMetaDataObject(metaData, new URLSearchParams('sub1=text1&first_name=Pasha&sub99=text99'))
//         expect(value).to.deep.equal({
//                 subaccounts: {
//                     sub1: 'text1',
//                     sub5: 'sub5',
//                     sub99: 'text99'
//                 },
//                 keyword: 'text',
//                 click_id: 'text',
//                 spclid: 'text'
//             }
//         )
//     })
//     it('Building Analytics object for Success and Fail types (returns as string)', () => {
//         const conversions = {
//             success: {
//                 name: "success_form_send",
//                 tools: ["facebook", "google_tag"]
//             },
//             fail: {
//                 name: "fail",
//                 tools: ["facebook"]
//             }
//         }
//         const valueSuccess = form.buildAnalyticsObjects(conversions, 'success')
//         expect(valueSuccess).equal('{"facebook":{"event":"success_form_send"},"google_tag":{"eventAction":"success_form_send"}}')
    
//         const valueFail = form.buildAnalyticsObjects(conversions, 'fail')
//         expect(valueFail).equal('{"facebook":{"event":"fail"}}')
//     })
// })
