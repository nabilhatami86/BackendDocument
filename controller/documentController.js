const path = require('path');
const { Document, User } = require('../models');
const fileSystem = require('fs');

const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findAll();
        if (!document) {
            return res.status(404).json({ message: "error" });
        }
        res.status(200).json(document);
    } catch (err) {
        console.log(err);
        return res.status(500).send('error getting data');
    }
};

const createDocument = async (req, res, next) => {
    try {
        // Check if the user is an admin or karyawan
        if (!(req.user && (req.user.role === 'admin' || req.user.role === 'karyawan'))) {
            return res.status(401).json({ message: "Access denied. Only admins and karyawan can create documents." });
        }

        const files = req.files;
        const document = files ? files.document : null;

        if (!document) return res.status(400).json({ message: 'Document not created' });

        const documentData = `${Date.now()}${path.extname(document.name)}`;
        const file = path.join(__dirname, '../public/document', documentData);

        document.mv(file, (err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to upload document", error: err });
            }
        });

        const datas = await Document.create({ document: `${req.protocol}://${req.get('host')}/public/document/${documentData}` });
        res.status(200).json({
            error: false,
            message: "Create data success",
            datas
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create data", error: err });
    }
};

const deleteDocument = async (req, res) => {
    try {
        // Check if the user is an admin or karyawan
        if (!(req.user && (req.user.role === 'admin' || req.user.role === 'karyawan'))) {
            return res.status(401).json({ message: "Access denied. Only admins and karyawan can delete documents." });
        }

        const dataDocument = await Document.findByPk(req.params.id);
        if (!dataDocument) return res.status(404).json({ message: `ID is not valid: ${req.params.id} not found` });

        const fileDocument = dataDocument.document.substring(dataDocument.document.lastIndexOf('/') + 1);
        const destroyDocument = path.join(__dirname, '../public', 'document', fileDocument);

        if (fileSystem.existsSync(destroyDocument)) {
            fileSystem.unlinkSync(destroyDocument);
        }

        await Document.destroy({ where: { id: req.params.id } });

        res.status(200).json({ message: "Delete data success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error", error: err });
    }
};

module.exports = {
    getDocument,
    createDocument,
    deleteDocument
};
