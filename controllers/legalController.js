const legalController = {
  getPrivacyPolicy: (req, res) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>นโยบายความเป็นส่วนตัว (Privacy Policy)</title>
          <style>
              * { box-sizing: border-box; }
              body { font-family: 'Sarabun', sans-serif; line-height: 1.8; padding: 20px; max-width: 860px; margin: 0 auto; color: #333; background: #f5f7fa; }
              h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 12px; font-size: 1.6em; }
              h2 { color: #2c3e50; margin-top: 24px; font-size: 1.1em; font-weight: 600; }
              p { margin-bottom: 14px; text-align: justify; }
              ul { margin-bottom: 14px; padding-left: 22px; }
              li { margin-bottom: 6px; }
              .container { background-color: #fff; padding: 36px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
              .contact-info { background-color: #eaf4fb; padding: 16px 20px; border-radius: 6px; border-left: 4px solid #3498db; margin-top: 8px; }
              .divider { border: none; border-top: 3px solid #3498db; margin: 48px 0; }
              .sub-list { margin-top: 4px; padding-left: 20px; }
              .sub-list li { margin-bottom: 4px; }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet">
      </head>
      <body>
          <div class="container">

              <!-- THAI VERSION -->
              <h1>นโยบายความเป็นส่วนตัว</h1>

              <h2>1. บทนำ</h2>
              <p>หากท่านติดต่อ บริษัท ต้นกล้า เทค จำกัด ("บริษัท") และประสงค์ให้บริษัทติดต่อกลับผ่านช่องทางการสื่อสารต่าง ๆ บริษัทอาจมีความจำเป็นต้องเก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลของท่านตามนโยบายความเป็นส่วนตัวฉบับนี้</p>
              <p>เมื่อท่านส่งข้อมูลส่วนบุคคลให้แก่บริษัทเพื่อวัตถุประสงค์ตามที่ระบุไว้ในเอกสารฉบับนี้ ถือว่าท่านได้รับทราบ เข้าใจ และยินยอมให้บริษัทเก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลของท่านตามนโยบายความเป็นส่วนตัวฉบับนี้</p>

              <h2>2. ข้อมูลส่วนบุคคลที่บริษัทเก็บรวบรวม</h2>
              <p>เพื่อให้ข้อมูล ตอบข้อซักถาม และประสานงานกับท่านเกี่ยวกับการติดต่อกับบริษัท บริษัทอาจเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของท่าน ดังต่อไปนี้</p>
              <ul>
                  <li><strong>ข้อมูลทั่วไป</strong>
                      <ul class="sub-list"><li>ชื่อ-นามสกุล</li></ul>
                  </li>
                  <li><strong>ข้อมูลการติดต่อ</strong>
                      <ul class="sub-list">
                          <li>หมายเลขโทรศัพท์</li>
                          <li>ที่อยู่อีเมล</li>
                      </ul>
                  </li>
                  <li><strong>ข้อมูลทางเทคนิค</strong>
                      <ul class="sub-list">
                          <li>หมายเลข IP Address</li>
                          <li>ข้อมูลการตั้งค่าเบราว์เซอร์และข้อมูลการเชื่อมต่อของอุปกรณ์ที่ใช้เข้าถึงเว็บไซต์ของบริษัท</li>
                          <li>ข้อมูลคุกกี้ (Cookies) และเทคโนโลยีที่คล้ายคลึงกัน ซึ่งใช้ในการวิเคราะห์และติดตามการใช้งานเว็บไซต์ของบริษัทที่ <a href="https://maopao.site/" target="_blank">https://maopao.site/</a></li>
                      </ul>
                  </li>
                  <li><strong>ข้อมูลส่วนบุคคลอื่น</strong>
                      <ul class="sub-list">
                          <li>ข้อมูลส่วนบุคคลอื่นใดที่ท่านสมัครใจให้แก่บริษัทระหว่างการติดต่อสื่อสาร</li>
                          <li>ข้อมูลส่วนบุคคลที่ท่านให้ความยินยอมแก่บริษัทในการประมวลผลเพื่อวัตถุประสงค์ตามที่ระบุไว้ในนโยบายความเป็นส่วนตัวฉบับนี้</li>
                      </ul>
                  </li>
              </ul>

              <h2>3. วัตถุประสงค์ในการประมวลผลข้อมูลส่วนบุคคล</h2>
              <p>บริษัทเก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังต่อไปนี้</p>
              <ul>
                  <li>เพื่อดำเนินการตอบกลับการติดต่อสื่อสารของท่าน ซึ่งรวมถึงแต่ไม่จำกัดเพียง
                      <ul class="sub-list">
                          <li>การจัดทำใบเสนอราคา</li>
                          <li>การตอบข้อซักถาม</li>
                          <li>การจัดส่งข้อมูลตามที่ร้องขอ</li>
                          <li>การรับและดำเนินการเกี่ยวกับข้อร้องเรียน</li>
                          <li>การให้บริการและการสนับสนุนลูกค้า</li>
                          <li>การรับความคิดเห็นหรือข้อเสนอแนะจากท่าน</li>
                      </ul>
                  </li>
                  <li>เพื่อสร้าง รักษา และพัฒนาความสัมพันธ์ทางธุรกิจระหว่างบริษัทกับท่าน รวมถึงการควบคุมคุณภาพ การบริหารจัดการบริการ การวิเคราะห์ การแก้ไขปัญหา และการพัฒนาสินค้าและบริการของบริษัทอย่างต่อเนื่อง</li>
                  <li>เพื่อวิเคราะห์ความสนใจและความต้องการของท่าน อันจะนำไปสู่การปรับปรุงบริการ การพัฒนากระบวนการให้บริการ การพัฒนาระบบการวิเคราะห์และการทดสอบต่าง ๆ ให้สามารถตอบสนองความต้องการและความคาดหวังของท่านได้ดียิ่งขึ้น รวมทั้งเพื่อเสริมสร้างความสัมพันธ์อันดีระหว่างบริษัทกับท่าน</li>
              </ul>
              <p>บริษัทจะเก็บรักษาและประมวลผลข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังกล่าวตลอดระยะเวลาที่บริษัทให้บริการแก่ท่าน และจะเก็บรักษาข้อมูลต่อไปอีกเป็นระยะเวลาที่เหมาะสมเท่าที่จำเป็น เพื่อการตรวจสอบ การบริหารจัดการ หรือเพื่อปฏิบัติตามกฎหมายและข้อกำหนดของหน่วยงานกำกับดูแลที่เกี่ยวข้อง</p>

              <h2>4. การเปิดเผยข้อมูลส่วนบุคคล</h2>
              <p>โดยหลักการ บริษัทจะเก็บรักษาข้อมูลส่วนบุคคลของท่านไว้เป็นความลับ อย่างไรก็ตาม บริษัทอาจเปิดเผยข้อมูลส่วนบุคคลของท่านในกรณีดังต่อไปนี้</p>
              <ul>
                  <li><strong>ผู้ให้บริการภายนอก</strong><br>บริษัทอาจเปิดเผยข้อมูลส่วนบุคคลของท่านแก่ผู้ให้บริการภายนอกที่ให้การสนับสนุนการดำเนินงานหรือการให้บริการของบริษัท ทั้งนี้ การเปิดเผยข้อมูลจะกระทำเฉพาะเท่าที่จำเป็นเพื่อวัตถุประสงค์ที่ระบุไว้ในนโยบายความเป็นส่วนตัวฉบับนี้</li>
                  <li><strong>การปฏิบัติตามกฎหมาย</strong><br>บริษัทอาจเปิดเผยข้อมูลส่วนบุคคลของท่านเมื่อกฎหมาย ระเบียบ ข้อบังคับ คำสั่งศาล หรือคำสั่งโดยชอบด้วยกฎหมายของหน่วยงานราชการหรือหน่วยงานกำกับดูแลที่มีอำนาจกำหนดให้บริษัทต้องดำเนินการดังกล่าว</li>
              </ul>

              <h2>5. มาตรการรักษาความมั่นคงปลอดภัยของข้อมูล</h2>
              <p>บริษัทมุ่งมั่นในการจัดให้มีมาตรการด้านเทคนิคและมาตรการด้านการบริหารจัดการที่เหมาะสม เพื่อป้องกันข้อมูลส่วนบุคคลของท่านจากการเข้าถึง การใช้งาน การเปลี่ยนแปลง การแก้ไข การเปิดเผย การสูญหาย หรือการทำลายโดยไม่ได้รับอนุญาตหรือโดยมิชอบด้วยกฎหมาย</p>
              <p>บริษัทจะทบทวนมาตรการรักษาความมั่นคงปลอดภัยดังกล่าวเป็นระยะ เพื่อให้มีความเหมาะสมและสอดคล้องกับกฎหมายที่ใช้บังคับ รวมถึงมาตรฐานด้านความปลอดภัยที่เป็นที่ยอมรับ</p>

              <h2>6. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
              <p>บริษัทเคารพสิทธิของท่านในฐานะเจ้าของข้อมูลส่วนบุคคลตามกฎหมายคุ้มครองข้อมูลส่วนบุคคลที่เกี่ยวข้อง</p>
              <p>ภายใต้หลักเกณฑ์และเงื่อนไขที่กฎหมายกำหนด ท่านมีสิทธิดังต่อไปนี้</p>
              <ul>
                  <li>สิทธิในการเข้าถึงข้อมูลส่วนบุคคลของท่าน</li>
                  <li>สิทธิในการขอรับสำเนาข้อมูลส่วนบุคคล</li>
                  <li>สิทธิในการขอแก้ไขหรือปรับปรุงข้อมูลส่วนบุคคลที่ไม่ถูกต้องหรือไม่สมบูรณ์</li>
                  <li>สิทธิในการคัดค้านการประมวลผลข้อมูลส่วนบุคคล</li>
                  <li>สิทธิในการขอโอนย้ายข้อมูลส่วนบุคคล (Data Portability) ในกรณีที่กฎหมายกำหนด</li>
                  <li>สิทธิในการขอให้ลบหรือทำลายข้อมูลส่วนบุคคลของท่าน เมื่อข้อมูลดังกล่าวหมดความจำเป็นตามวัตถุประสงค์ที่เก็บรวบรวมไว้ หรือในกรณีอื่นตามที่กฎหมายกำหนด</li>
              </ul>
              <p>หากท่านประสงค์จะใช้สิทธิดังกล่าว หรือมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้ สามารถติดต่อบริษัทได้ที่</p>
              <div class="contact-info">
                  <strong>บริษัท ต้นกล้า เทค จำกัด</strong><br>
                  ไอดีไลน์: @032hpymx<br>
                  อีเมล: <a href="mailto:tonklatech@gmail.com">tonklatech@gmail.com</a>
              </div>

              <hr class="divider">

              <!-- ENGLISH VERSION -->
              <h1>Privacy Policy</h1>

              <h2>1. Introduction</h2>
              <p>If you contact Tonkla Tech Co., Ltd. ("the Company") and request that we contact you through any communication channel, the Company may need to collect, use, and process your personal data in accordance with this Privacy Policy.</p>
              <p>By submitting your personal data to the Company for the purposes described herein, you acknowledge that you have read, understood, and agreed to the collection, use, and processing of your personal data in accordance with this Privacy Policy.</p>

              <h2>2. Personal Data We Collect</h2>
              <p>To provide information, respond to your inquiries, and coordinate with you regarding your communications with the Company, we may collect and process the following categories of personal data:</p>
              <ul>
                  <li><strong>General Information</strong>
                      <ul class="sub-list"><li>Full name.</li></ul>
                  </li>
                  <li><strong>Contact Information</strong>
                      <ul class="sub-list">
                          <li>Telephone number.</li>
                          <li>Email address.</li>
                      </ul>
                  </li>
                  <li><strong>Technical Information</strong>
                      <ul class="sub-list">
                          <li>IP address.</li>
                          <li>Browser settings and connection information of the device used to access our website.</li>
                          <li>Cookies and similar technologies used to analyze and monitor your usage of our website at <a href="https://maopao.site/" target="_blank">https://maopao.site/</a>.</li>
                      </ul>
                  </li>
                  <li><strong>Other Personal Data</strong>
                      <ul class="sub-list">
                          <li>Any other personal data that you voluntarily provide during communications with the Company.</li>
                          <li>Any personal data that you consent to the Company processing for the purposes described in this Privacy Policy.</li>
                      </ul>
                  </li>
              </ul>

              <h2>3. Purposes of Processing Personal Data</h2>
              <p>The Company collects, uses, and processes your personal data for the following purposes:</p>
              <ul>
                  <li>To respond to your inquiries and communications, including but not limited to:
                      <ul class="sub-list">
                          <li>Providing quotations;</li>
                          <li>Answering questions;</li>
                          <li>Supplying requested information;</li>
                          <li>Handling complaints;</li>
                          <li>Providing customer support; and</li>
                          <li>Receiving your comments or feedback.</li>
                      </ul>
                  </li>
                  <li>To establish, maintain, and improve our business relationship with you, including quality assurance, service management, analysis, troubleshooting, and continuous improvement of our products and services.</li>
                  <li>To analyze your interests and preferences in order to improve our services, optimize our service processes, develop analytical and testing mechanisms, better meet your needs and expectations, and strengthen our relationship with you.</li>
              </ul>
              <p>The Company will retain and process your personal data for the purposes stated above throughout the period during which we provide services to you, and thereafter for a reasonable period as necessary to verify, administer, or comply with legal or regulatory obligations relating to such services.</p>

              <h2>4. Disclosure of Personal Data</h2>
              <p>As a general principle, the Company will keep your personal data confidential. However, your personal data may be disclosed under the following circumstances:</p>
              <ul>
                  <li><strong>Service Providers</strong><br>The Company may disclose your personal data to third-party service providers who assist us in delivering our services. Such disclosure will be limited to the extent necessary for the purposes described in this Privacy Policy.</li>
                  <li><strong>Legal Compliance</strong><br>The Company may disclose your personal data where required by applicable laws, regulations, court orders, or lawful requests from government authorities or regulatory agencies.</li>
              </ul>

              <h2>5. Security Measures</h2>
              <p>The Company is committed to implementing appropriate technical and organizational security measures to protect your personal data against unauthorized or unlawful access, use, alteration, modification, disclosure, loss, or destruction.</p>
              <p>These security measures are reviewed periodically to ensure they remain appropriate and compliant with applicable laws and industry standards.</p>

              <h2>6. Your Rights</h2>
              <p>The Company respects your rights as a data subject under applicable data protection laws.</p>
              <p>Subject to applicable legal requirements, you may exercise the following rights:</p>
              <ul>
                  <li>The right to access your personal data;</li>
                  <li>The right to obtain a copy of your personal data;</li>
                  <li>The right to request correction or updating of inaccurate or incomplete personal data;</li>
                  <li>The right to object to the processing of your personal data;</li>
                  <li>The right to data portability, where applicable;</li>
                  <li>The right to request the deletion or destruction of your personal data when it is no longer necessary for the purposes for which it was collected or as otherwise permitted by law.</li>
              </ul>
              <p>If you wish to exercise any of these rights or have any questions regarding this Privacy Policy, please contact us:</p>
              <div class="contact-info">
                  <strong>Tonkla Tech Co., Ltd.</strong><br>
                  ID Line: @032hpymx<br>
                  Email: <a href="mailto:tonklatech@gmail.com">tonklatech@gmail.com</a>
              </div>

          </div>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  },

  getTermsAndConditions: (req, res) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ข้อกำหนดและเงื่อนไข (Terms and Conditions)</title>
          <style>
              body { font-family: 'Sarabun', sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
              h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
              h2 { color: #34495e; margin-top: 20px; font-size: 1.2em; }
              p { margin-bottom: 15px; text-align: justify; }
              .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet">
      </head>
      <body>
          <div class="container">
              <h1>ข้อกำหนดและเงื่อนไข</h1>
              <p><strong>ปรับปรุงล่าสุดเมื่อ:</strong> ${new Date().toLocaleDateString('th-TH')}</p>

              <h2>ข้อกำหนดทั่วไป</h2>
              <p>การเข้าถึงและการใช้งานเว็บไซต์ของ บริษัท ต้นกล้า เทค จำกัด ("บริษัท") อยู่ภายใต้บังคับของกฎหมายแห่งราชอาณาจักรไทย และเป็นไปตามข้อกำหนดและเงื่อนไขดังต่อไปนี้</p>
              <p>เมื่อท่านเข้าถึงหรือใช้งานเว็บไซต์นี้ ถือว่าท่านได้รับทราบ เข้าใจ และตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขฉบับนี้</p>

              <h2>เครื่องหมายการค้า</h2>
              <p>เครื่องหมายการค้า เครื่องหมายบริการ โลโก้ ชื่อทางการค้า และทรัพย์สินทางปัญญาอื่น ๆ ทั้งหมดที่ปรากฏบนเว็บไซต์นี้ เป็นกรรมสิทธิ์แต่เพียงผู้เดียวของ บริษัท ต้นกล้า เทค จำกัด เว้นแต่จะระบุไว้เป็นอย่างอื่น</p>
              <p>ห้ามมิให้บุคคลใดนำส่วนหนึ่งส่วนใดของเว็บไซต์ไปใช้ ทำซ้ำ คัดลอก ดัดแปลง หรือเผยแพร่ ไม่ว่าทั้งหมดหรือบางส่วน โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรจากบริษัทล่วงหน้า</p>

              <h2>เนื้อหาบนเว็บไซต์</h2>
              <p>ข้อมูลที่ปรากฏบนเว็บไซต์นี้จัดทำขึ้นเพื่อวัตถุประสงค์ในการให้ข้อมูลทั่วไปเท่านั้น มิได้มีเจตนาเพื่อวัตถุประสงค์เฉพาะใด ๆ และบริษัทไม่ได้ให้การรับรองหรือรับประกัน ไม่ว่าโดยชัดแจ้งหรือโดยปริยาย เกี่ยวกับความถูกต้อง ความครบถ้วน ความน่าเชื่อถือ หรือความเหมาะสมของข้อมูลดังกล่าว</p>
              <p>บริษัท ต้นกล้า เทค จำกัด รวมถึงกรรมการ พนักงาน ผู้แทน หรือผู้ได้รับมอบหมายของบริษัท จะไม่รับผิดชอบต่อความสูญเสีย ความเสียหาย ค่าใช้จ่าย หรือความรับผิดใด ๆ ที่เกิดขึ้น ไม่ว่าโดยทางตรงหรือทางอ้อม อันเนื่องมาจากการเข้าถึง การใช้งาน หรือการอาศัยข้อมูลจากเว็บไซต์นี้ หรือเว็บไซต์อื่นที่เชื่อมโยงกับเว็บไซต์นี้</p>
              <p>บริษัทขอสงวนสิทธิในการแก้ไข ปรับปรุง ระงับ หรือลบข้อมูลหรือเนื้อหาใด ๆ บนเว็บไซต์นี้ได้ทุกเวลา ตามดุลยพินิจของบริษัท โดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้า</p>

              <h2>การเชื่อมโยงไปยังเว็บไซต์ของบุคคลที่สาม</h2>
              <p>เว็บไซต์นี้อาจมีการเชื่อมโยง (Link) ไปยังเว็บไซต์ของบุคคลที่สามเพื่อความสะดวกหรือเพื่อใช้เป็นข้อมูลอ้างอิง ทั้งนี้ การเชื่อมโยงดังกล่าวมิได้หมายความว่าบริษัทรับรอง อนุมัติ แนะนำ หรือมีความเกี่ยวข้องกับผู้ดำเนินการหรือเจ้าของเว็บไซต์เหล่านั้นแต่อย่างใด</p>
              <p>บริษัทและพนักงานของบริษัทจะไม่รับผิดชอบต่อข้อมูล เนื้อหา สินค้า บริการ ความคิดเห็น หรือสื่อใด ๆ ที่เผยแพร่ จัดทำ หรือให้บริการโดยเว็บไซต์ของบุคคลที่สามดังกล่าว ผู้ใช้งานที่เข้าถึงเว็บไซต์เหล่านั้นจะต้องรับความเสี่ยงด้วยตนเองทั้งหมด</p>
              <p>การปรากฏของลิงก์ไปยังเว็บไซต์ของบุคคลที่สาม ไม่อาจตีความได้ว่าบริษัทให้การรับรองหรือรับประกันความถูกต้อง ความน่าเชื่อถือ หรือความเหมาะสมของข้อมูลหรือเนื้อหาที่ปรากฏบนเว็บไซต์เหล่านั้น</p>

              <hr style="margin: 40px 0; border: none; border-top: 2px solid #eee;">

              <h1>Terms and Conditions</h1>
              <p><strong>Last updated:</strong> ${new Date().toLocaleDateString('en-GB')}</p>

              <h2>General</h2>
              <p>Your access to and use of the website of Tonkla Tech Co., Ltd. ("the Company") shall be governed by the laws of the Kingdom of Thailand and by the following Terms and Conditions.</p>
              <p>By accessing or using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.</p>

              <h2>Trademarks</h2>
              <p>All trademarks, service marks, logos, trade names, and other intellectual property displayed on this website are the exclusive property of Tonkla Tech Co., Ltd., unless otherwise stated.</p>
              <p>No part of this website may be used, reproduced, copied, modified, or distributed without the Company's prior written consent.</p>

              <h2>Website Content</h2>
              <p>The information contained on this website is provided for general informational purposes only. It is not intended for any specific purpose and is provided without any express or implied warranties regarding its accuracy, completeness, reliability, or suitability.</p>
              <p>Neither Tonkla Tech Co., Ltd., its directors, employees, representatives, nor agents shall be liable for any loss, damage, expense, or liability arising directly or indirectly from the access to, use of, or reliance upon this website or any websites linked to it.</p>
              <p>The Company reserves the right to modify, update, suspend, or remove any information or content on this website at any time without prior notice, at its sole discretion.</p>

              <h2>Links to Third-Party Websites</h2>
              <p>This website may contain links to third-party websites for your convenience or reference. Such links do not constitute or imply any endorsement, approval, recommendation, or affiliation by Tonkla Tech Co., Ltd. with the operators or owners of those websites.</p>
              <p>The Company and its employees shall not be responsible or liable for any information, content, products, services, opinions, or materials published, provided, or made available on any third-party website. Users access such websites entirely at their own risk.</p>
              <p>The inclusion of any link to a third-party website shall not be construed as an endorsement or representation by the Company regarding the accuracy, reliability, or suitability of the information contained therein.</p>
          </div>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  }
};

module.exports = legalController;
