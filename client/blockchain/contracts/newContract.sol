// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DigitalDocumentRegistry {

    enum Status { Pending, Verified, Rejected }

    struct Document {
        uint256 id;
        address owner;
        string title;
        string fileHash; // FINAL IPFS CID disimpan di sini
        string date;
        Status status;
    }

    uint256 public docCounter;
    mapping(uint256 => Document) public documents;
    mapping(address => uint256[]) public userDocuments;

    address public institution;

    event DocumentUploaded(uint256 id, address owner, string title);
    event DocumentVerified(uint256 id);
    event DocumentRejected(uint256 id);
    event IPFSAttached(uint256 id, string cid);

    constructor() {
        institution = msg.sender;
    }

    modifier onlyInstitution() {
        require(msg.sender == institution, "Not authorized");
        _;
    }

    function uploadDocument(
        string memory _title,
        string memory _tempHash,
        string memory _date
    ) public {

        docCounter++;

        documents[docCounter] = Document({
            id: docCounter,
            owner: msg.sender,
            title: _title,
            fileHash: _tempHash, // temporary pre-verification hash
            date: _date,
            status: Status.Pending
        });

        userDocuments[msg.sender].push(docCounter);

        emit DocumentUploaded(docCounter, msg.sender, _title);
    }

    function verifyDocument(uint256 _id) public onlyInstitution {
        documents[_id].status = Status.Verified;
        emit DocumentVerified(_id);
    }

    function rejectDocument(uint256 _id) public onlyInstitution {
        documents[_id].status = Status.Rejected;
        emit DocumentRejected(_id);
    }

    // Called AFTER verification, once file is uploaded to IPFS
    function attachIPFS(uint256 _id, string memory _cid) public onlyInstitution {
        require(documents[_id].status == Status.Verified, "Document not verified");
        documents[_id].fileHash = _cid;
        emit IPFSAttached(_id, _cid);
    }

    function getDocumentsByUser(address user) public view returns (Document[] memory) {
        uint256[] memory ids = userDocuments[user];
        Document[] memory result = new Document[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = documents[ids[i]];
        }

        return result;
    }
}