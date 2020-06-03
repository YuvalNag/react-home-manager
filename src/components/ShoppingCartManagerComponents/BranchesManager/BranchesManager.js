import React, { Fragment, useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { IoIosPin, IoIosArrowDown } from 'react-icons/io'
import './BranchesManager.css';
import { FaRegBuilding } from 'react-icons/fa'
import BranchesModal from './BranchesModal/BranchesModal'
import BranchesTable from './BranchesTable/BranchesTable'
import { Fade } from 'react-bootstrap'

const BranchesManager = props => {
    const [showBranchesModel, setBranchesModel] = useState(false)
    const [open, setOpen] = useState(false);

    const { searchTerm } = props
    useEffect(() => {
        // console.log('searchTerm',searchTerm);
        
        if (searchTerm !== '') {
            setOpen(false)
        }

        return () => {
            // cleanup
        }
    }, [searchTerm, open])
    return (
        <Fragment>
            <BranchesModal
                loading={props.loading}
                show={showBranchesModel}
                setModal={setBranchesModel}
                submit={props.submitUpdateChosenBranches}
                optionalBranches={props.optionalBranches}
            />
            <div style={{
                borderColor: '#007bff',
                borderStyle: 'solid',
                width: '99%'
            }}>

                <div className=' d-inline-flex rounded' style={{
                    justifyContent: 'space-around',
                    alignItems: 'baseline',
                    width: '99%'
                }}>


                    <div>
                        <Button className='rounded-circle my-1 '
                            variant='outline-primary'
                            onClick={() => {
                                props.getAllAvailableBranches();
                                setBranchesModel(true);
                            }}>
                            <FaRegBuilding size='18px' />
                        </Button>
                    </div>
                    <div>
                        <Button className='rounded-circle  my-1'
                            variant='outline-primary'
                            onClick={() => {
                                props.getClosestAvailableBranches();
                                setBranchesModel(true);
                            }}>
                            <IoIosPin size='18px' />
                        </Button>
                    </div>
                    <h5 className='text-white'>:הסניפים שנבחרו</h5>
                    <div style={{ color: 'rgb(0, 123, 255)' }}
                        onClick={() => setOpen(!open)}>
                        <IoIosArrowDown size='18px' />
                    </div>
                </div>



                <Fade in={open} mountOnEnter unmountOnExit>
                    <span>
                        <BranchesTable
                            loading={props.loading}
                            located={props.located}
                            chosenBranches={props.chosenBranches}
                            currentBranchId={props.currentBranchId}
                            branchClicked={props.branchClicked}
                            removeChosenBranch={props.removeChosenBranch}
                        />
                    </span>
                </Fade >
            </div>
        </Fragment>
    )
}
export default BranchesManager