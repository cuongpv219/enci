<?php

$targetFolder = $_POST['targetFolder'];
if (is_dir($_SERVER['DOCUMENT_ROOT'] . $targetFolder) && !empty($_FILES)) {
    $tempFile = $_FILES['Filedata']['tmp_name'];
    $targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;

    $targetFile = rtrim($targetPath, '/') . '/' . $_FILES['Filedata']['name'];
    //var_dump($_FILES['Filedata']) ;die;
    // Kiem tra ton tai hay chua
    $newName = null;
    if (file_exists($_SERVER['DOCUMENT_ROOT'] . $targetFolder . '/' . $_FILES['Filedata']['name'])) {
        $newName = date('hsidmY') . '_' . $_FILES['Filedata']['name'];
        $targetFile = rtrim($targetPath, '/') . '/' . $newName;
    }

    // Validate the file type
    $fileTypes = array('jpg', 'jpeg', 'png', 'mp3'); // File extensions
    $fileParts = pathinfo($_FILES['Filedata']['name']);
    $ext = strtolower($fileParts['extension']);
    if (in_array($ext, $fileTypes)) {
        move_uploaded_file($tempFile, $targetFile);
        $newUploadFile = rtrim($targetFolder, '/') . '/' . ($newName == null ? $_FILES['Filedata']['name'] : $newName);

        // Tạo thêm bản sao cho ảnh
        if ($ext != 'mp3') {
            $filename = substr(strrchr($targetFile, "/"), 1);
            copy($targetFile, rtrim($targetPath, '/') . '/original_' . $filename);
        }
        // $s3TargetFile = trim($targetFolder . '/' . $_FILES['Filedata']['name'], '/');
        $s3TargetFile = trim($targetFolder . '/' . ($newName == null ? $_FILES['Filedata']['name'] : $newName), '/');
        Ucan_Utility_Resource::getS3Storage()->storeItem(
                $s3TargetFile, file_get_contents($targetFile), array(
            Zend_Cloud_StorageService_Adapter_S3::METADATA => array(
                Zend_Service_Amazon_S3::S3_ACL_HEADER => Zend_Service_Amazon_S3::S3_ACL_PUBLIC_READ,
            ))
        );

        // Goi service Ucan de send request sang viettel
//        $prefix = 'http://' . $_SERVER["SERVER_NAME"];
//        $curl = $prefix . '/shark/public/service/viettel/sync-media?url=/' . $s3TargetFile;
//        $ch = curl_init();
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//        curl_setopt($ch, CURLOPT_URL, $curl);
//        curl_exec($ch);

        echo $newUploadFile;
    } else {
        echo 'Invalid file type.';
    }
}
?>