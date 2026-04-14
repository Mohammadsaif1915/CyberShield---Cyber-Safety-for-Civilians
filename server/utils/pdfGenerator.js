import PDFDocument from 'pdfkit';

export const generateAdminExportPDF = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
      });

      let buffers = [];
      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('CyberShield Admin Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.8);

      // Summary Section
      doc.fontSize(14).font('Helvetica-Bold').text('Summary Statistics', { underline: true });
      doc.moveDown(0.3);
      
      const summaryData = `
Total Users: ${data.summary.totalUsers}
Total Quiz Attempts: ${data.summary.totalQuizAttempts}
Average Score: ${data.summary.avgScore}%
Export Date: ${new Date().toLocaleDateString()}
      `.trim();

      doc.fontSize(11).font('Helvetica');
      summaryData.split('\n').forEach(line => {
        doc.text(line);
      });
      doc.moveDown(0.8);

      // Users Section
      if (data.users && data.users.length > 0) {
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('User Data', { underline: true });
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 150;
        const col3 = 280;
        const col4 = 400;
        const col5 = 500;
        const rowHeight = 20;

        // Table header
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Name', col1, tableTop);
        doc.text('Email', col2, tableTop);
        doc.text('Score', col3, tableTop);
        doc.text('Quizzes', col4, tableTop);
        doc.text('Joined', col5, tableTop);

        // Table rows
        doc.font('Helvetica').fontSize(9);
        let yPosition = tableTop + rowHeight;

        data.users.slice(0, 30).forEach((user) => {
          if (yPosition > 750) {
            doc.addPage();
            yPosition = 40;
          }

          const joinDate = user.createdAt 
            ? new Date(user.createdAt).toLocaleDateString() 
            : 'N/A';

          doc.text(user.fullName || 'N/A', col1, yPosition);
          doc.text(user.email || 'N/A', col2, yPosition);
          doc.text(user.score || '0', col3, yPosition);
          doc.text(user.quizzesAttempted || '0', col4, yPosition);
          doc.text(joinDate, col5, yPosition);

          yPosition += rowHeight;
        });

        doc.moveDown(1);
      }

      // Quiz Statistics Section
      if (data.quizResults && data.quizResults.length > 0) {
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('Quiz Results Summary', { underline: true });
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 200;
        const col3 = 350;
        const col4 = 480;
        const rowHeight = 20;

        // Table header
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('User', col1, tableTop);
        doc.text('Module', col2, tableTop);
        doc.text('Score', col3, tableTop);
        doc.text('Date', col4, tableTop);

        // Table rows
        doc.font('Helvetica').fontSize(9);
        let yPosition = tableTop + rowHeight;

        data.quizResults.slice(0, 40).forEach((result) => {
          if (yPosition > 750) {
            doc.addPage();
            yPosition = 40;
          }

          const resultDate = result.createdAt 
            ? new Date(result.createdAt).toLocaleDateString() 
            : 'N/A';

          doc.text(result.userId || 'N/A', col1, yPosition, { width: 140 });
          doc.text(result.moduleTitle || 'N/A', col2, yPosition, { width: 140 });
          doc.text(`${result.percentage || 0}%`, col3, yPosition);
          doc.text(resultDate, col4, yPosition);

          yPosition += rowHeight;
        });

        doc.moveDown(1);
      }

      // Footer on all pages
      const pages = doc.bufferedPageRange().count;
      for (let i = 0; i < pages; i++) {
        doc.switchToPage(i);
        doc.fontSize(9).font('Helvetica');
        doc.text(
          `CyberShield Admin Dashboard © ${new Date().getFullYear()} | Page ${i + 1} of ${pages}`,
          40,
          doc.page.height - 30,
          { align: 'center', width: 515 }
        );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
