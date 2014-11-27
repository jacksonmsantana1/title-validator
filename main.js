
function TitleValidator() {

    var isDate = function (d) {
        return !!d._isAMomentObject;
    };
    //The parameter now its just the name
    var checkName = function (name) {
        if (name) {
            return /^[a-zA-Z'-˜~\s]+$/.test(name) && !/^[a-zA-Z'-˜~]+$/.test(name);
        }
        return false;
    };
    var checkDocumentId = function (person) {
        return {
            type: checkDocType(person.documentId.type),
            number: checkDocNumber(person.documentId)
        };
    };

    //The parameter now its just the document type - person.documentId.type
    var checkDocType = function (type){
        return  typeof type === 'string'
            && /^(cpf|cnpj|other)$/.test(type);
    };

    //The parameter now its just the documentId - person.documentId
    var checkDocNumber = function (documentId){
        if (!!documentId && !!documentId.type && documentId.number) {
            var number = documentId.number,
                type = documentId.type,
                CPF_LENGTH = 11,
                CNPJ_LENGTH = 14,
                cpfRegex = new  RegExp('^(\\d){' + CPF_LENGTH + '}$'),
                cnpjRegex = new RegExp('^(\\d){' + CNPJ_LENGTH + '}$');

            if (typeof number === 'string') {
                if (type == 'cpf' && cpfRegex.test(number)) {
                    return validatedCPF(number);
                } else if (type == 'cnpj' && cnpjRegex.test(number)) {
                    return validateCPNJ(number);
                } else if (type == 'other') {
                    return true;
                }
            }
        }
        return false;
    };

    /*
     * Validates the CPF returning true or false.
     * The param must be a string with 11 numbers
     * @param cpf string
     **/
    var validatedCPF = function (cpf){
        var add = 0,
            rev,
            i;

        if (cpf === "00000000000" ||
            cpf === "11111111111" ||
            cpf === "22222222222" ||
            cpf === "33333333333" ||
            cpf === "44444444444" ||
            cpf === "55555555555" ||
            cpf === "66666666666" ||
            cpf === "77777777777" ||
            cpf === "88888888888" ||
            cpf === "99999999999") {
            return false;
        }

        for (i = 0; i < 9; i ++) {
            add += parseInt(cpf.charAt(i)) * (10 - i);
        }

        rev = 11 - (add % 11);

        if (rev === 10 || rev === 11) {
            rev = 0;
        }

        if (rev != parseInt(cpf.charAt(9))) {
            return false;
        }

        add = 0;

        for (i = 0; i < 10; i++) {
            add += parseInt(cpf.charAt(i)) * (11 - i);
        }

        rev = 11 - (add % 11);

        if (rev === 10 || rev === 11) {
            rev = 0;
        }

        return rev === parseInt(cpf.charAt(10), 10);
    };

    /*
     * Validates the CNPJ returning true or false.
     * The param must be a string with 14 numbers
     * @param string
     **/
    var validateCPNJ = function (cnpj) {

        if (cnpj === "00000000000000" ||
            cnpj === "11111111111111" ||
            cnpj === "22222222222222" ||
            cnpj === "33333333333333" ||
            cnpj === "44444444444444" ||
            cnpj === "55555555555555" ||
            cnpj === "66666666666666" ||
            cnpj === "77777777777777" ||
            cnpj === "88888888888888" ||
            cnpj === "99999999999999") {
            return false;
        }

        var cnpjLength = cnpj.length - 2,
            numbers = cnpj.substring(0,cnpjLength),
            digits = cnpj.substring(cnpjLength),
            sum = 0,
            position = cnpjLength - 7,
            result,
            i;

        for (i = cnpjLength; i >= 1; i--) {
            sum += numbers.charAt(cnpjLength - i) * position--;

            if (position < 2) {
                position = 9;
            }
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result != digits.charAt(0)) {
            return false;
        }

        cnpjLength = cnpjLength + 1;
        numbers = cnpj.substring(0,cnpjLength);
        sum = 0;
        position = cnpjLength - 7;

        for (i = cnpjLength; i >= 1; i--) {
            sum += numbers.charAt(cnpjLength - i) * position--;
            if (position < 2){
                position = 9;
            }
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        return result === parseInt(digits.charAt(1), 10);
    };

    var checkAddress = function (person) {
        return {
            street: checkAddressStreet(person.address.street),
            neighborhood: checkAddressNeiborhood(person.address.neighborhood),
            zipcode: checkZipCode(person.address.zipcode),
            city: checkCity(person.address.city),
            state: checkState(person.address.state)
        };
    };

    //The parameter now its just the street - person.address.street
    var checkAddressStreet = function (street) {
        return  typeof street === 'string'
            && !(street === '') ;
    };

    //The parameter now its just the neighborhood - person.address.neighborhood
    var checkAddressNeiborhood = function (neighborhood) {
        return  typeof neighborhood === 'string'
            && !(neighborhood === '') ;
    };

    //The parameter now its just the zipcode - person.address.zipcode
    var checkZipCode = function (zipcode) {
        return  typeof zipcode === 'string'
            && !(zipcode === '') && /^\d{8}$/.test(zipcode);
    };

    //The parameter now its just the state - person.address.state
    var checkState = function (state) {
        var estateList = ['ac', 'al', 'ap', 'am', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mt', 'ms', 'mg', 'pa', 'pb', 'pr', 'pe', 'pi', 'rj', 'rn', 'rs', 'ro', 'rr', 'sc', 'sp', 'se', 'to'];
        return _.contains(estateList, state);
    };

    //The parameter now its just the address - person.address
    var checkCity = function(state,city, callback) {
        //TODO Modify with angular functions later..
        return true;
    };

    var checkIssueDate = function (title) {
        return !!title.issueDate && isDate(title.issueDate) && title.issueDate.isBefore(title.dueDate);
    };
    var checkDueDate = function (dueDate) {
        return !!dueDate && isDate(dueDate) && dueDate.isBefore(moment());
    };
    var checkPersonData = function (person) {
        return {
            name: checkName(person),
            documentId: checkDocumentId(person),
            address: checkAddress(person)
        };
    };
    var checkDebtors = function (debtors){
        var allDebtors = [];
        _.each(debtors, function (debtor){
            allDebtors.push(checkPersonData(debtor));
        });
        return allDebtors;
    };
    //TODO modify it when the titleType will made a bank for it!
    var checkTitleType = function (titleType) {
        /*return $scope.types.some(function (type) {
            return type.code === titleType;
        });*/
        return true;
    };
    //The parameter now its just the titleNumber - title.titleNumber
    var checkTitleNumber = function (titleNumber) {
        return  typeof titleNumber === 'string' && !( titleNumber === '' );
    };
    var isPositiveNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n) && Number(n) > 0;
    };
    //The parameter now its just the endorsementType - title.endorsementType
    var checkEndorsement = function (endorsementType){
        return !!endorsementType && typeof endorsementType === 'string' &&
            /^(Translativo|Mandato|Sem\ Endosso)$/.test(endorsementType);
    };
    //The parameter now its just the bankruptcyProtest - title.bankruptcyProtest
    var checkbankruptcyProtest = function (bankruptcyProtest) {
        return bankruptcyProtest === true || bankruptcyProtest === false;
    };
    return {
        checkbankruptcyProtest:checkbankruptcyProtest,
        checkEndorsement:checkEndorsement,
        isPositiveNumber:isPositiveNumber,
        checkTitleNumber:checkTitleNumber,
        checkTitleType:checkTitleType,
        checkDebtors:checkDebtors,
        checkPersonData:checkPersonData,
        checkDueDate:checkDueDate,
        checkIssueDate:checkIssueDate,
        checkCity:checkCity,
        checkState:checkState,
        checkZipCode:checkZipCode,
        checkAddressNeiborhood:checkAddressNeiborhood,
        checkAddressStreet:checkAddressStreet,
        checkAddress:checkAddress,
        validateCPNJ:validateCPNJ,
        validatedCPF:validatedCPF,
        checkDocNumber:checkDocNumber,
        checkDocType:checkDocType,
        checkDocumentId:checkDocumentId,
        checkName:checkName,
        isDate:isDate
    };

 }


