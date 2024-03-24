var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.isadmin) {
        return res.render('customer/login', {message: "Restricted Area - Need Amin Privs"});
    }
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// ==================================================
router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT package_id, packagename, qtyincluded, packagestyle FROM package";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.render('error');
        }
        res.render('package/allrecords', {allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3010/product/3/show
// ==================================================
router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT package_id, packagename, qtyincluded, packagestyle FROM package WHERE package_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('package/onerec', {onerec: result[0] });
        }
    });
});


// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', adminonly, function(req, res, next) {
    res.render('package/addrec');
});



// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', adminonly, function(req, res, next) {
    let insertquery = "INSERT INTO package (packagename, qtyincluded, packagestyle) VALUES (?, ?, ?)";
    db.query(insertquery,[req.body.packagename, req.body.qtyincluded, req.body.packagestyle],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/package');
        }
    });
});


// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT package_id, packagename, qtyincluded, packagestyle FROM package WHERE package_id = "
    + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('package/editrec', {onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function(req, res, next) {
    let updatequery = "UPDATE package SET packagename = ?, qtyincluded = ?, packagestyle = ? WHERE package_id = " + req.body.package_id;
    db.query(updatequery,[req.body.packagename, req.body.qtyincluded, req.body.packagestyle],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/package');
        }
    });
});
    

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM package WHERE package_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/package');
        }
    });
});
    


module.exports = router;
